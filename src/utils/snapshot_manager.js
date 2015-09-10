import _ from "underscore"
import remote from "remote"
import fs from "fs-extra"
import path from "path"

const _cacheFile = path.join(remote.require("app").getPath("appData"),
  "DownQuark", "snapshot.json")

export default function SnapshotManager(flux) {
  return {
    save: _.debounce(() => {
      fs.outputFile(_cacheFile, flux.takeSnapshot())
    }, 200),

    restore: (done) => {
      fs.readFile(_cacheFile, "utf-8", (err, snapshot) => {
        if (!err) flux.bootstrap(snapshot)
        done()
      })
    }
  }
}
