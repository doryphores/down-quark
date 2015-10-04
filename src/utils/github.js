import remote from "remote"
import os from "os"
import fs from "fs-extra"
import path from "path"
import _ from "underscore"
import GithubAPI from "github"

const app = remote.require("app")

const PUBLIC_KEY_PATH = path.join(
  app.getPath("appData"),
  app.getName(),
  "id_rsa.pub"
)

const PRIVATE_KEY_PATH = path.join(
  app.getPath("appData"),
  app.getName(),
  "id_rsa"
)

export default class GitHub {
  constructor() {
    this.githubAPI = new GithubAPI({version: "3.0.0"})
  }

  /**
   * Sets up basic authentication for the next Github API call
   * @param  {string} email
   * @param  {string} password
   */
  authenticate(email, password, operation) {
    this.githubAPI.authenticate({
      type     : "basic",
      username : email,
      password : password
    })
    // Deferring the actual operation works best for some reason
    _.defer(operation)
  }

  /**
   * Does the following:
   *  - Generates a new key pair if one does not exist
   *  - Uploads it to Github if necessary
   *  - Retrieves the user's name and passes it to the callback
   * @param {string}   email    Github account email address
   * @param {string}   password Github password
   * @param {Function} done     Callback
   */
  setup(email, password, done) {
    this.authenticate(email, password, () => {
      this.getUserDetails((err, details) => {
        // Set email on details because we can't retrieve it from github if
        // it isn't public
        details.email = email

        if (err) return done(err)
        console.log("SETUP KEY")
        fs.readFile(PUBLIC_KEY_PATH, "utf8", (_err, publicKey) => {
          if (publicKey) {
            console.log("A KEY ALREADY EXISTS")
            this.authenticate(email, password, () => {
              this.githubAPI.user.getKeys({}, (err, keys) => {
                if (err) return done(err)
                if (_.findWhere(keys, {key: publicKey.trim()})) {
                  console.log("AND GITHUB KNOWS ABOUT IT")
                  done(null, details)
                } else {
                  this.authenticate(email, password, () => {
                    this.sendKeyToGithub(publicKey, (err) => {
                      if (err) return done(err)
                      done(null, details)
                    })
                  })
                }
              })
            })
          } else {
            this.generateKeyPair((err, publicKey) => {
              if (err) return done(err)
              this.authenticate(email, password, () => {
                this.sendKeyToGithub(publicKey, (err) => {
                  if (err) return done(err)
                  done(null, details)
                })
              })
            })
          }
        })
      })
    })
  }

  /**
   * Generates a new OpenSSH key pair and saves to disk
   * @param {Function} done  callback
   */
  generateKeyPair(done) {
    // Forge doesn't work well in the renderer process
    // so require it from the "browser" process
    const forge = require("remote").require("node-forge")

    console.log("GENERATING A NEW KEY")

    forge.pki.rsa.generateKeyPair(2048, (err, keypair) => {
      console.log("KEY GENERATED")
      if (err) return done(err)

      // Convert key pair to OpenSSH format
      const privateKey = forge.ssh.privateKeyToOpenSSH(keypair.privateKey, "")
      const publicKey  = forge.ssh.publicKeyToOpenSSH(keypair.publicKey)

      // Write keys to disk
      fs.ensureDir(path.dirname(PUBLIC_KEY_PATH), (err) => {
        console.log("WRITING KEYS TO DISK")
        if (err) return done(err)

        fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, {mode: 0o400})
        fs.writeFileSync(PUBLIC_KEY_PATH, publicKey)

        console.log("KEYS WRITTEN TO DISK")

        done(null, publicKey)
      })
    })
  }

  /**
   * Uploads the given public key to Github
   * @param {string}   publicKey
   * @param {Function} done
   */
  sendKeyToGithub(publicKey, done) {
    console.log("SENDING KEYS TO GITHUB")
    this.githubAPI.user.createKey({
      title : `${app.getName()} - (${os.platform()} - ${os.hostname()})`,
      key   : publicKey
    }, (err) => {
      console.log("KEYS SENT TO GITHUB")
      if (err) return done(err)
      done()
    })
  }

  getUserDetails(done) {
    console.log("GETTING USER NAME FROM GITHUB")
    this.githubAPI.user.get({}, (err, result) => {
      if (err) return done(err)
      done(null, {
        username: result.login,
        name: result.name,
        avatar_url: result.avatar_url
      })
    })
  }
}
