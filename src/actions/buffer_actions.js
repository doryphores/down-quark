import Dialogs from "../utils/dialogs"

export default class BufferActions {
  open(filePath) {
    this.dispatch(filePath)
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

  changeContent({id, content} = {}) {
    this.dispatch({
      id      : id,
      content : content
    })
  }
}
