var packager = require("electron-packager")
var path = require("path")

packager({
  dir: path.resolve(__dirname + "/.."),
  out: path.resolve(__dirname + "/../dist"),
  name: "DownQuark",
  platform: "linux",
  arch: "x64",
  version: "0.30.6",
  ignore: [
    "^/dist($|/)",
    "^/node_modules/\.bin($|/)",
    "/node_modules/.*/(docs|test)($|/)"
  ],
  asar: true,
  prune: true,
  overwrite: true
}, function (err, appPath) {
  console.log("All done!")
})
