import remote from "remote"
import Dialogs from "../utils/dialogs"

var Menu   = remote.require("menu")

export default class TreeMenu {
  constructor(flux, node) {
    this.flux = flux
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
            this.flux.getActions("FileSystemActions").delete(this.node.path)
          })
        }
      },
      {
        label: "Move",
        click: () => {
          Dialogs.saveAs(this.node.path, "Move").then((newPath) => {
            this.flux.getActions("FileSystemActions").move(this.node.path, newPath)
          })
        }
      }
    ]
  }
}
