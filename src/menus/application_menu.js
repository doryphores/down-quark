import remote from "remote"
import FileSystemActions from "../actions/file_system_actions"

const template = [
  {
    label: "Down Quark",
    submenu: [
      {
        label: "About Down Quark",
        selector: "orderFrontStandardAboutPanel:"
      }
    ]
  },
  {
    label: "File",
    submenu: [
      {
        label: "New file",
        accelerator: "CmdOrCtrl+N",
        click: FileSystemActions.newFile
      },
      {
        label: "Open folder...",
        accelerator: "CmdOrCtrl+O",
        click: FileSystemActions.openFolder
      },
      {
        type: "separator"
      },
      {
        label: "Save",
        accelerator: "CmdOrCtrl+S",
        click: FileSystemActions.save
      },
      {
        label: "Save As...",
        accelerator: "Shift+CmdOrCtrl+S",
        click: FileSystemActions.saveAs
      },
      {
        type: "separator"
      },
      {
        label: "Close Tab",
        accelerator: "CmdOrCtrl+W",
        click: FileSystemActions.closeFile
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: () => { remote.getCurrentWindow().reload() }
      },
      {
        label: "Toggle DevTools",
        accelerator: "Alt+CmdOrCtrl+I",
        click: () => { remote.getCurrentWindow().toggleDevTools() }
      }
    ]
  }
]

export default remote.require("menu").buildFromTemplate(template)
