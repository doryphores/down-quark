import remote from "remote"
import LocalStorageManager from "../utils/local_storage_manager"
import _ from "underscore"

export default function initWindow() {
  const win = remote.getCurrentWindow()
  const dims = LocalStorageManager.get("windowDimensions")

  const saveDims = _.debounce(() => {
    LocalStorageManager.set("windowDimensions", {
      bounds    : win.getBounds(),
      maximized : win.isMaximized()
    })
  }, 100);

  ["move", "resize"].forEach((event) => {
    win.removeAllListeners(event)
    win.on(event, saveDims)
  })

  if (dims) {
    win.setBounds(dims.bounds)
    win.show()

    // Maximizing on OSX is a bit odd
    if (process.platform != "darwin" && dims.maximized) {
      win.maximize()
    }
  }
}
