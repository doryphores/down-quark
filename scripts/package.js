var packager = require("electron-packager")
var path = require("path")
var pkgjson = require("../app/package.json")
var os = require("os")

var projectDir = path.resolve(path.join(__dirname, ".."))
var appDir = path.join(projectDir, "app")

var icon = os.platform() == "darwin" ? "icon.icns" : "icon.png"

packager({
  dir: appDir,
  out: path.join(projectDir, "dist"),
  name: pkgjson.productName,
  appVersion: pkgjson.version,
  icon: path.join(projectDir, "images", icon),
  platform: os.platform(),
  arch: os.arch(),
  version: pkgjson.engines.electron,
  ignore: [
    "^/node_modules/\.bin($|/)",
    "/node_modules/.*/(docs|test)($|/)",
    "/node_modules/node-forge/(nodejs|tests|swf|flash|setup|mod_fsp)($|/)"
  ],
  asar: true,
  prune: true,
  overwrite: true
}, function (err, appPath) {
  console.log("All done!")
})
