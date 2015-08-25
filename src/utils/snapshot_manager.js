import _ from "underscore"
import remote from "remote"
import alt from "../alt"
import fs from "fs-extra"
import path from "path"

const _cacheFile = path.join(remote.require("app").getPath("appData"),
  "DownQuark", "snapshot.json")

module.exports = {
  save: _.debounce(() => {
    fs.outputFile(_cacheFile, alt.takeSnapshot())
  }),

  restore: () => {
    fs.readFile(_cacheFile, {
      encoding: "utf-8"
    }, (err, snapshot) => {
      if (err) return
      alt.bootstrap(snapshot)
    })
  }
}
