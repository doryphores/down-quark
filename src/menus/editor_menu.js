import remote from "remote"
import EditorCommands from "../utils/editor_commands"

const Menu = remote.require("menu")

export default class EditorMenu {
  constructor(flux, node) {
    this.menu = Menu.buildFromTemplate(this.template())
  }

  show() {
    this.menu.popup(remote.getCurrentWindow())
  }

  template() {
    return [
      {
        label: "Undo",
        click: () => EditorCommands.send("undo")
      },
      {
        label: "Redo",
        click: () => EditorCommands.send("redo")
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        click: () => EditorCommands.send("cut")
      },
      {
        label: "Copy",
        click: () => EditorCommands.send("copy")
      },
      {
        label: "Paste",
        click: () => EditorCommands.send("paste")
      },
      {
        label: "Select all",
        click: () => EditorCommands.send("selectAll")
      },
      {
        type: "separator"
      },
      {
        label: "Bold",
        click: () => EditorCommands.send("bold")
      },
      {
        label: "Italic",
        click: () => EditorCommands.send("italic")
      }
    ]
  }
}
