import alt from "../alt"

class EditorActions {
  changeContent(filePath, content) {
    this.dispatch({
      filePath: filePath,
      content: content
    })
  }

  saveFile() {
    this.dispatch()
  }
}

export default alt.createActions(EditorActions)
