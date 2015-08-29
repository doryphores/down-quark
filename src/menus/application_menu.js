import remote from "remote"
import FileSystemActions from "../actions/file_system_actions"

const Menu = remote.require("menu")

export default class ApplicationMenu {
  constructor() {
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template()))
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
              FileSystemActions.new()
            }
          },
          {
            label: "Open folder...",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              FileSystemActions.openFolder()
            }
          },
          {
            type: "separator"
          },
          {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click: () => {
              FileSystemActions.save()
            }
          },
          {
            label: "Save As...",
            accelerator: "Shift+CmdOrCtrl+S",
            click: () => {
              FileSystemActions.saveAs()
            }
          },
          {
            type: "separator"
          },
          {
            label: "Close Tab",
            accelerator: "CmdOrCtrl+W",
            click: () => {
              FileSystemActions.close()
            }
          },
          {
            label: "Close All",
            accelerator: "Shift+CmdOrCtrl+W",
            click: () => {
              FileSystemActions.closeAll()
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
            accelerator: "Alt+CmdOrCtrl+I",
            click: () => {
              remote.getCurrentWindow().toggleDevTools()
            }
          }
        ]
      }
    ]
  }
}
