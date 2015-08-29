import remote from "remote"
import LocalStorageManager from "../utils/local_storage_manager"

var saveDims = function () {
  LocalStorageManager.set("windowDimensions", {
    x         : window.screenX,
    y         : window.screenY,
    width     : window.outerWidth,
    height    : window.outerHeight,
    maximized : remote.getCurrentWindow().isMaximized()
  })
}

export default function initWindow() {
  window.addEventListener("unload", saveDims)
  window.addEventListener("resize", saveDims)

  var dims = LocalStorageManager.get("windowDimensions")

  if (dims) {
    if (dims.maximized === "true") {
      remote.getCurrentWindow().show()
      remote.getCurrentWindow().maximize()
    } else {
      window.resizeTo(dims.width, dims.height)
      window.moveTo(dims.x, dims.y)
    }
  }

  remote.getCurrentWindow().show()
}
