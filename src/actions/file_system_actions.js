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

  closeFile() {
    this.dispatch()
  }

  save() {
    this.dispatch()
  }

  saveAs(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(FileSystemActions)
