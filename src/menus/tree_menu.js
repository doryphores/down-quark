import remote from "remote"
import FileSystemActions from "../actions/file_system_actions"
import Dialogs from "../utils/dialogs"

var Menu   = remote.require("menu")

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
          Dialogs.confirmDelete(this.node.path).then(() => {
            FileSystemActions.delete(this.node.path)
          })
        }
      },
      {
        label: "Move",
        click: () => {
          Dialogs.saveAs(this.node.path, "Move").then((newPath) => {
            FileSystemActions.move(this.node.path, newPath)
          })
        }
      }
    ]
  }
}
