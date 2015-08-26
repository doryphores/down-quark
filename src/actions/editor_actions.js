import alt from "../alt"

class EditorActions {
  changeContent(data) {
    this.dispatch(data)
  }
}

export default alt.createActions(EditorActions)
