import Dialogs from "../utils/dialogs"

export default class TreeActions {
  select(nodePath) {
    this.dispatch(nodePath)
  }

  expand(node) {
    this.dispatch(node)
  }

  collapse(node) {
    this.dispatch(node)
  }

  delete(nodePath) {
    Dialogs.confirmDelete(nodePath).then(() => {
      this.dispatch(nodePath)
    })
  }

  move(nodePath) {
    Dialogs.saveAs(nodePath, "Move").then((newPath) => {
      this.dispatch({
        nodePath : nodePath,
        newPath  : newPath
      })
    })
  }
}
