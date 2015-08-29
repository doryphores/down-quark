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
        else reject()
      })
    })
  },

  saveAs(defaultPath) {
    return new Promise((resolve, reject) => {
      Dialog.showSaveDialog(remote.getCurrentWindow(), {
        title       : "Save as",
        defaultPath : defaultPath
      }, filename => {
        if (filename) resolve(filename)
        else reject()
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
        if (buttonIndex == 1) reject()
        else resolve(buttonIndex == 0)
      })
    })
  }
}
