import alt from "../alt"
import remote from "remote"

function getCurrentWindow() {
  return remote.getCurrentWindow()
}

class FileSystemActions {
  openFolder() {
    remote.require("dialog").showOpenDialog(getCurrentWindow(), {
      title: "Open folder",
      properties: ["openDirectory"]
    }, (filenames) => {
      if (filenames) this.dispatch(filenames[0])
    })
  }

  // TODO: this should prob go somewhere else
  openFile(filePath) {
    this.dispatch(filePath)
  }

  // TODO: this should prob go somewhere else
  closeFile(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(FileSystemActions)
