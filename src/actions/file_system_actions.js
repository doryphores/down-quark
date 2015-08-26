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

  openFile(filePath) {
    this.dispatch(filePath)
  }

  newFile() {
    this.dispatch()
  }

  closeFile() {
    this.dispatch()
  }

  save() {
    this.dispatch()
  }

  saveAs() {
    remote.require("dialog").showSaveDialog(getCurrentWindow(), {
      title: "Save as"
    }, (filename) => {
      if (filename) this.dispatch(filename)
    })
  }
}

export default alt.createActions(FileSystemActions)
