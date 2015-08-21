import alt from "../alt"
import remote from "remote"

function getCurrentWindow() {
  return remote.getCurrentWindow()
}

class FileSystemActions {
  selectFolder() {
    this.dispatch()
    remote.require("dialog").showOpenDialog(getCurrentWindow(), {
      title: "Open",
      properties: ["openDirectory"]
    }, (filenames) => {
      if (filenames) {
        this.actions.openFolder({
          rootPath: filenames[0]
        })
      }
    })
  }

  openFolder(dirname) {
    this.dispatch(dirname)
  }

  openFile(filePath) {
    this.dispatch(filePath)
  }

  closeFile(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(FileSystemActions)
