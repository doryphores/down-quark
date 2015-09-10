import remote from "remote"

const Dialog = remote.require("dialog")

module.exports = {
  selectFolder() {
    return new Promise((resolve, reject) => {
      Dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: "Open folder",
        properties: ["openDirectory"]
      }, (filenames) => {
        if (filenames) resolve(filenames[0])
      })
    })
  },

  saveAs(defaultPath, title = "Save as") {
    return new Promise((resolve, reject) => {
      Dialog.showSaveDialog(remote.getCurrentWindow(), {
        title       : title,
        defaultPath : defaultPath
      }, filename => {
        if (filename) resolve(filename)
      })
    })
  },

  confirmClose(name, path) {
    return new Promise((resolve, reject) => {
      Dialog.showMessageBox(remote.getCurrentWindow(), {
        buttons: ["Save", "Cancel", "Don't save"],
        title: "Save Changes",
        message: `'${name}' has changes, do you want to save them?`,
        detail: "Your changes will be lost if you close this item without saving."
      }, (buttonIndex) => {
        if (buttonIndex != 1) resolve(buttonIndex == 0)
      })
    })
  },

  confirmDelete(path) {
    return new Promise((resolve, reject) => {
      Dialog.showMessageBox(remote.getCurrentWindow(), {
        buttons: ["Move to Trash", "Cancel"],
        message: "Are you sure you want to delete the selected item?",
        detail: `You are deleting: '${path}'`
      }, (buttonIndex) => {
        if (buttonIndex == 0) resolve()
      })
    })
  }
}
