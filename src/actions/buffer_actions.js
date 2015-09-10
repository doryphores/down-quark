import Dialogs from "../utils/dialogs"

export default class BufferActions {
  open(filePath) {
    this.dispatch(filePath)
  }

  save(index) {
    let buffer = this.alt.getStore("BufferStore").getBuffer(index)

    if (!buffer) return Promise.reject("Attempting to save a buffer that does not exist")

    return new Promise((resolve, reject) => {
      if (buffer.filePath) {
        this.dispatch({ index: index })
        resolve()
      } else {
        this.alt.getActions("BufferActions").saveAs(index).then(() => {
          resolve()
        })
      }
    })
  }

  saveAs(index) {
    if (this.alt.getStore("BufferStore").getBuffer(index) === undefined) {
      return Promise.reject("Attempting to save a buffer that does not exist")
    }

    let rootPath = this.alt.getStore("ProjectStore").getState().contentPath
    return Dialogs.saveAs(rootPath).then((filename) => {
      this.dispatch({
        index    : index,
        filePath : filename
      })
    })
  }

  changeContent({id, content} = {}) {
    this.dispatch({
      id      : id,
      content : content
    })
  }
}
