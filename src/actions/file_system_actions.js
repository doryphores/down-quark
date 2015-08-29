import alt from "../alt"
import remote from "remote"
import Dialogs from "../utils/dialogs"

class FileSystemActions {
  openFolder(folderPath) {
    Dialogs.selectFolder().then((folderPath) => this.dispatch(folderPath))
  }

  openFile(filePath) {
    this.dispatch(filePath)
  }

  newFile() {
    this.dispatch()
  }

  closeFile(index) {
    let FileBufferStore = require("../stores/file_buffer_store")
    let buffer = FileBufferStore.getBuffer(index)

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
    let FileBufferStore = require("../stores/file_buffer_store")
    let buffer = FileBufferStore.getBuffer(index)

    if (buffer === undefined) return

    if (buffer.path) {
      this.dispatch({
        index       : index,
        closeOnSave : closeOnSave
      })
    } else {
      let TreeStore = require("../stores/tree_store")

      Dialogs.saveAs(TreeStore.getRootPath()).then((filename) => {
        this.dispatch({
          index       : index,
          filePath    : filename,
          closeOnSave : closeOnSave
        })
      })
    }
  }

  saveAs() {
    let TreeStore = require("../stores/tree_store")

    Dialogs.saveAs(TreeStore.getRootPath()).then((filename) => {
      this.dispatch({ filePath: filename })
    })
  }

  delete(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(FileSystemActions)
