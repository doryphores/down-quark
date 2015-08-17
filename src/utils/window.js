import remote from "remote"
import Screen from "screen"

var saveDims = function () {
  window.localStorage.setItem("windowDimensions", JSON.stringify({
    x: window.screenX,
    y: window.screenY,
    width: window.outerWidth,
    height: window.outerHeight,
    maximized: remote.getCurrentWindow().isMaximized()
  }))
}

export default function initWindow() {
  window.addEventListener("unload", saveDims)
  window.addEventListener("resize", saveDims)

  var dims = JSON.parse(window.localStorage.getItem("windowDimensions"))

  if (dims) {
    if (dims.maximized) {
      remote.getCurrentWindow().maximize()
    } else {
      window.resizeTo(dims.width, dims.height)
      window.moveTo(dims.x, dims.y)
    }
  }

  remote.getCurrentWindow().show()
}
