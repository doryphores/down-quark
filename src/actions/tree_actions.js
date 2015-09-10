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
}
