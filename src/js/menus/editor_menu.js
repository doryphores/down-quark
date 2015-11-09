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
        // TODO: role doesn't work here, not sure why
        click: () => EditorCommands.send("undo")
      },
      {
        label: "Redo",
        // TODO: role doesn't work here, not sure why
        click: () => EditorCommands.send("redo")
      },
      {
        type: "separator"
      },
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
      },
      {
        label: "Link",
        click: () => EditorCommands.send("link")
      }
    ]
  }
}
