import remote from "remote"
import FileSystemActions from "../actions/file_system_actions"

var Menu   = remote.require("menu")
var Dialog = remote.require("dialog")

export default class TreeMenu {
  constructor(node) {
    this.node = node
    this.menu = Menu.buildFromTemplate(this.template())
  }

  show() {
    setTimeout(() => {
      this.menu.popup(remote.getCurrentWindow())
    }, 100)
  }

  template() {
    return [
      {
        label: "Delete",
        click: () => {
          Dialog.showMessageBox(remote.getCurrentWindow(), {
            type: "question",
            buttons: ["Move to Trash", "Cancel"],
            message: "Are you sure you want to delete the selected item?",
            detail: `You are deleting: ${this.node.path}`
          }, (buttonIndex) => {
            if (buttonIndex == 0) FileSystemActions.delete(this.node.path)
          })
        }
      }
    ]
  }
}
