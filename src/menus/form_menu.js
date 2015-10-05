import remote from "remote"

const Menu = remote.require("menu")

export default class FormMenu {
  constructor() {
    this.menu = Menu.buildFromTemplate(this.template())
  }

  show() {
    this.menu.popup(remote.getCurrentWindow())
  }

  template() {
    return [
      {
        label: "Cut",
        role: "cut"
      },
      {
        label: "Copy",
        role: "copy"
      },
      {
        label: "Paste",
        role: "paste"
      }
    ]
  }
}
