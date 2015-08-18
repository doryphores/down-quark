import alt from "../alt"

class TreeActions {
  expand(nodePath) {
    this.dispatch(nodePath)
  }

  collapse(node) {
    this.dispatch(node)
  }
}

export default alt.createActions(TreeActions)
