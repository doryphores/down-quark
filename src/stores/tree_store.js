import alt from "../alt"
import FileSystemActions from "../actions/file_system_actions"
import FileTree from "../utils/file_tree"
import TreeActions from "../actions/tree_actions"

class TreeStore {
  constructor() {
    this.tree = null

    this.bindListeners({
      openFolder: FileSystemActions.OPEN_FOLDER,
      expandNode: TreeActions.EXPAND,
      collapseNode: TreeActions.COLLAPSE
    })
  }

  openFolder(dirname) {
    this.tree = new FileTree(dirname)
    this.tree.on("change", this.emitChange.bind(this))
  }

  expandNode(node) {
    node.open()
  }

  collapseNode(node) {
    node.close()
  }
}

export default alt.createStore(TreeStore, "TreeStore")
