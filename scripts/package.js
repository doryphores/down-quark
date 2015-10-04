var packager = require("electron-packager")
var path = require("path")
var pkgjson = require("../package.json")
var os = require("os")

var projectDir = path.resolve(path.join(__dirname, ".."))

var icon = os.platform() == "darwin" ? "icon.icns" : "icon.png"

packager({
  dir: projectDir,
  out: path.join(projectDir, "dist"),
  name: pkgjson.productName,
  appVersion: pkgjson.version,
  icon: path.join(projectDir, "static", "images", icon),
  platform: os.platform(),
  arch: os.arch(),
  version: pkgjson.devDependencies["electron-prebuilt"],
  ignore: [
    "^/(docs|dist|src|stylus|psd)($|/)",
    "^/node_modules/\.bin($|/)",
    "/node_modules/.*/(docs|test)($|/)",
    "/node_modules/node-forge/(nodejs|tests|swf|flash|setup|mode_fsp)($|/)"
  ],
  asar: true,
  prune: true,
  overwrite: true
}, function (err, appPath) {
  console.log("All done!")
})
