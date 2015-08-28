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

  save() {
    this.dispatch()
  }

  saveAs(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(FileSystemActions)
