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

  save() {
    this.dispatch()
  }
}

export default alt.createActions(FileSystemActions)
