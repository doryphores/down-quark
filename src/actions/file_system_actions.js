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
        this.actions.openFolder(filenames[0])
      }
    })
  }

  openFolder(dirname) {
    this.dispatch(dirname)
  }
}

export default alt.createActions(FileSystemActions)
