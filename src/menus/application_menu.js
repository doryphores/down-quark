import remote from "remote"

const Menu = remote.require("menu")

export default class ApplicationMenu {
  constructor(flux) {
    this.flux = flux
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
              this.flux.getActions("FileSystemActions").new()
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
              this.flux.getActions("FileSystemActions").save()
            }
          },
          {
            label: "Save As...",
            accelerator: "Shift+CmdOrCtrl+S",
            click: () => {
              this.flux.getActions("FileSystemActions").saveAs()
            }
          },
          {
            type: "separator"
          },
          {
            label: "Close Tab",
            accelerator: "CmdOrCtrl+W",
            click: () => {
              this.flux.getActions("FileSystemActions").close()
            }
          },
          {
            label: "Close All",
            accelerator: "Shift+CmdOrCtrl+W",
            click: () => {
              this.flux.getActions("FileSystemActions").closeAll()
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
