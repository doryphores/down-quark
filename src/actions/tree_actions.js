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

  delete(filePath) {
    this.dispatch(filePath)
  }

  move(nodePath, newPath) {
    this.dispatch({
      nodePath : nodePath,
      newPath  : newPath
    })
  }
}
