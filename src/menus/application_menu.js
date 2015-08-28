import remote from "remote"
import FileSystemActions from "../actions/file_system_actions"
import FileBufferStore from "../stores/file_buffer_store"

var Menu   = remote.require("menu")
var Dialog = remote.require("dialog")

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
              FileSystemActions.newFile()
            }
          },
          {
            label: "Open folder...",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              Dialog.showOpenDialog(remote.getCurrentWindow(), {
                title: "Open folder",
                properties: ["openDirectory"]
              }, (filenames) => {
                if (filenames) FileSystemActions.openFolder(filenames[0])
              })
            }
          },
          {
            type: "separator"
          },
          {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click: () => {
              this.save((filename) => {
                FileSystemActions.save(filename)
              })
            }
          },
          {
            label: "Save As...",
            accelerator: "Shift+CmdOrCtrl+S",
            click: () => {
              var activeBuffer = FileBufferStore.getActiveBuffer()

              if (activeBuffer === undefined) return

              Dialog.showSaveDialog(remote.getCurrentWindow(), {
                title       : "Save as",
                defaultPath : activeBuffer.path
              }, (filename) => {
                if (filename) FileSystemActions.save(filename)
              })
            }
          },
          {
            type: "separator"
          },
          {
            label: "Close Tab",
            accelerator: "CmdOrCtrl+W",
            click: () => {
              var activeBuffer = FileBufferStore.getActiveBuffer()

              if (activeBuffer && !activeBuffer.clean) {
                Dialog.showMessageBox(remote.getCurrentWindow(), {
                  type: "question",
                  buttons: ["Save", "Cancel", "Don't save"],
                  message: `${activeBuffer.name}' has changes, do you want to save them?`,
                  detail: "Your changes will be lost if you close this item without saving."
                }, (buttonIndex) => {
                  if (buttonIndex == 0) {
                    this.save((filename) => {
                      FileSystemActions.save(filename, true)
                    })
                  } else if (buttonIndex == 2) {
                    FileSystemActions.closeFile()
                  }
                })
              } else {
                FileSystemActions.closeFile()
              }
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

  save(callback) {
    var activeBuffer = FileBufferStore.getActiveBuffer()

    if (activeBuffer && activeBuffer.path) {
      callback()
    } else {
      Dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: "Save as"
      }, (filename) => {
        if (filename) callback(filename)
      })
    }
  }
}
