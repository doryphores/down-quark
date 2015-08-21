import alt from "../alt"

class EditorActions {
  changeContent(data) {
    this.dispatch(data)
  }

  saveFile() {
    this.dispatch()
  }
}

export default alt.createActions(EditorActions)
