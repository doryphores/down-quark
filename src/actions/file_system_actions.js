import remote from "remote"
import Dialogs from "../utils/dialogs"

export default class FileSystemActions {
  open(filePath) {
    this.dispatch(filePath)
  }

  new() {
    this.dispatch()
  }

  close(index) {
    let buffer = this.alt.getStore("BufferStore").getBuffer(index)

    if (!buffer) return

    if (!buffer.clean) {
      Dialogs.confirmClose(buffer.name).then((save) => {
        if (save) {
          this.actions.save(index, true)
        } else {
          this.dispatch(index)
        }
      })
    } else {
      this.dispatch(index)
    }
  }

  closeAll() {
    this.dispatch()
  }

  save(index, closeOnSave = false) {
    let buffer = this.alt.getStore("BufferStore").getBuffer(index)

    if (buffer === undefined) return

    if (buffer.filePath) {
      this.dispatch({
        index       : index,
        closeOnSave : closeOnSave
      })
    } else {
      let rootPath = this.alt.getStore("ProjectStore").getState().contentPath

      Dialogs.saveAs(rootPath).then((filename) => {
        this.dispatch({
          index       : index,
          filePath    : filename,
          closeOnSave : closeOnSave
        })
      })
    }
  }

  saveAs() {
    let rootPath = this.alt.getStore("ProjectStore").getState().contentPath

    Dialogs.saveAs(rootPath).then((filename) => {
      this.dispatch({ filePath: filename })
    })
  }

  delete(filePath) {
    this.dispatch(filePath)
  }

  move(nodePath, newPath) {
    this.dispatch({
      nodePath : nodePath,
      newPath  : newPath
    })
  }
}
