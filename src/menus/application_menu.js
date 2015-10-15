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
    let template = [
      {
        label: "File",
        submenu: [
          {
            label: "New file",
            accelerator: "CmdOrCtrl+N",
            click: () => this.flux.getActions("TabActions").new()
          },
          {
            label: "Open folder...",
            accelerator: "CmdOrCtrl+O",
            click: () => this.flux.getActions("ProjectActions").open()
          },
          {
            type: "separator"
          },
          {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click: () => this.flux.getActions("BufferActions").save()
          },
          {
            label: "Save As...",
            accelerator: "Shift+CmdOrCtrl+S",
            click: () => this.flux.getActions("BufferActions").saveAs()
          },
          {
            type: "separator"
          },
          {
            label: "Close Tab",
            accelerator: "CmdOrCtrl+W",
            click: () => this.flux.getActions("TabActions").close()
          },
          {
            label: "Close All",
            accelerator: "Shift+CmdOrCtrl+W",
            click: () => this.flux.getActions("TabActions").closeAll()
          }
        ]
      },
      {
        label: "Edit",
        submenu: [
          {
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            role: "undo"
          },
          {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            role: "redo"
          },
          {
            type: "separator"
          },
          {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            role: "cut"
          },
          {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            role: "copy"
          },
          {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            role: "paste"
          },
          {
            label: "Select All",
            // TODO: this does not work in the editor
            accelerator: "CmdOrCtrl+A",
            role: "selectall"
          }
        ]
      },
      {
        label: "Format",
        submenu: [
          {
            label: "Bold",
            accelerator: "CmdOrCtrl+B",
            click: () => EditorCommands.send("bold")
          },
          {
            label: "Italic",
            accelerator: "CmdOrCtrl+I",
            click: () => EditorCommands.send("italic")
          },
          {
            label: "Link",
            accelerator: "CmdOrCtrl+L",
            click: () => EditorCommands.send("link")
          }
        ]
      },
      {
        label: "View",
        submenu: [
          {
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click: () => remote.getCurrentWindow().reload()
          },
          {
            label: "Toggle DevTools",
            accelerator: process.platform == "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
            click: () => remote.getCurrentWindow().toggleDevTools()
          },
          {
            type: "separator"
          },
          {
            label: "Increase Font Size",
            accelerator: "CmdOrCtrl+=",
            click: () => this.flux.getActions("PrefActions").increaseFontSize()
          },
          {
            label: "Decrease Font Size",
            accelerator: "CmdOrCtrl+-",
            click: () => this.flux.getActions("PrefActions").decreaseFontSize()
          },
          {
            label: "Reset Font Size",
            accelerator: "CmdOrCtrl+0",
            click: () => this.flux.getActions("PrefActions").resetFontSize()
          }
        ]
      }
    ]

    if (process.platform == "darwin") {
      let appName = remote.require("app").getName()

      template.unshift({
        label: appName,
        submenu: [
          {
            label: "About " + appName,
            selector: "orderFrontStandardAboutPanel:"
          },
          {
            type: "separator"
          },
          {
            label: "Preferences...",
            accelerator: "CmdOrCtrl+,",
            click: () => this.flux.getActions("PrefActions").togglePanel()
          },
          {
            type: "separator"
          },
          {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: () => remote.getCurrentWindow().close()
          }
        ]
      })
    } else {
      template[0].submenu.push({
        type: "separator"
      })

      template[0].submenu.push({
        label: "Quit",
        accelerator: "Ctrl+Q",
        click: () => remote.getCurrentWindow().close()
      })

      template[1].submenu.push({
        type: "separator"
      })

      template[1].submenu.push({
        label: "Preferences...",
        accelerator: "Ctrl+,",
        click: () => this.flux.getActions("PrefActions").togglePanel()
      })
    }

    return template
  }
}
