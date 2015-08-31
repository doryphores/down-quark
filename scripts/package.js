var packager = require("electron-packager")
var path = require("path")
var pkgjson = require("../package.json")
var os = require("os")

var projectDir = path.resolve(path.join(__dirname, ".."))

packager({
  dir: projectDir,
  out: path.join(projectDir, "dist"),
  appVersion: pkgjson.version,
  name: pkgjson.name,
  platform: os.platform(),
  arch: os.arch(),
  version: pkgjson.devDependencies["electron-prebuilt"],
  ignore: [
    "^/(dist|src|stylus)($|/)",
    "^/node_modules/\.bin($|/)",
    "/node_modules/.*/(docs|test)($|/)"
  ],
  asar: true,
  prune: true,
  overwrite: true
}, function (err, appPath) {
  console.log("All done!")
})
