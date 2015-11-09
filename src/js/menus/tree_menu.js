import remote from "remote"

const Menu = remote.require("menu")

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
          this.flux.actions.TreeActions.delete(this.node.path)
        }
      },
      {
        label: "Move",
        click: () => {
          this.flux.actions.TreeActions.move(this.node.path)
        }
      }
    ]
  }
}
