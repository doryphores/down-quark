import remote from "remote"
import EditorCommands from "../utils/editor_commands"

const Menu = remote.require("menu")

export default class ApplicationMenu {
  constructor(flux) {
    this.flux = flux
    this.menu = Menu.buildFromTemplate(this.template())
    Menu.setApplicationMenu(this.menu)
  }

  template() {
    return [
      {
        label: "Down Quark",
        submenu: [
          {
            label: "About Down Quark",
            selector: "orderFrontStandardAboutPanel:"
          },
          {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
              remote.require("app").quit()
            }
          }
        ]
      },
      {
        label: "File",
        submenu: [
          {
            label: "New file",
            accelerator: "CmdOrCtrl+N",
            click: () => {
              this.flux.getActions("TabActions").new()
            }
          },
          {
            label: "Open folder...",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              this.flux.getActions("ProjectActions").open()
            }
          },
          {
            type: "separator"
          },
          {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click: () => {
              this.flux.getActions("BufferActions").save()
            }
          },
          {
            label: "Save As...",
            accelerator: "Shift+CmdOrCtrl+S",
            click: () => {
              this.flux.getActions("BufferActions").saveAs()
            }
          },
          {
            type: "separator"
          },
          {
            label: "Close Tab",
            accelerator: "CmdOrCtrl+W",
            click: () => {
              this.flux.getActions("TabActions").close()
            }
          },
          {
            label: "Close All",
            accelerator: "Shift+CmdOrCtrl+W",
            click: () => {
              this.flux.getActions("TabActions").closeAll()
            }
          }
        ]
      },
      {
        label: "Edit",
        submenu: [
          {
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            click: () => {
              EditorCommands.send("undo")
            }
          },
          {
            label: "Redo",
            accelerator: "CmdOrCtrl+Shift+Z",
            click: () => {
              EditorCommands.send("redo")
            }
          },
          {
            type: "separator"
          },
          {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            click: () => {
              EditorCommands.send("cut")
            }
          },
          {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            click: () => {
              EditorCommands.send("copy")
            }
          },
          {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            click: () => {
              EditorCommands.send("paste")
            }
          },
          {
            label: "Select all",
            accelerator: "CmdOrCtrl+A",
            click: () => {
              EditorCommands.send("selectAll")
            }
          }
        ]
      },
      {
        label: "View",
        submenu: [
          {
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click: () => {
              remote.getCurrentWindow().reload()
            }
          },
          {
            label: "Toggle DevTools",
            accelerator: process.platform == "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
            click: () => {
              remote.getCurrentWindow().toggleDevTools()
            }
          }
        ]
      }
    ]
  }
}
