import alt from "../alt"

class FileSystemActions {
  openFolder(folderPath) {
    this.dispatch(folderPath)
  }

  openFile(filePath) {
    this.dispatch(filePath)
  }

  newFile() {
    this.dispatch()
  }

  closeFile(index) {
    this.dispatch(index)
  }

  closeAll() {
    this.dispatch()
  }

  save(filePath, closeOnSave = false) {
    this.dispatch({
      filePath    : filePath,
      closeOnSave : closeOnSave
    })
  }

  delete(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(FileSystemActions)
