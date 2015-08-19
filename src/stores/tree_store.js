import alt from "../alt"
import FileSystemActions from "../actions/file_system_actions"
import FileTree from "../utils/file_tree"
import TreeActions from "../actions/tree_actions"

class TreeStore {
  constructor() {
    this.root = null
    this.selectedPath = null

    this.bindListeners({
      openFolder   : FileSystemActions.OPEN_FOLDER,
      expandNode   : TreeActions.EXPAND,
      collapseNode : TreeActions.COLLAPSE,
      selectNode   : TreeActions.SELECT
    })
  }

  openFolder(dirname) {
    this.root = new FileTree(dirname)
    this.root.on("change", this.emitChange.bind(this))
  }

  expandNode(node) {
    node.open()
  }

  collapseNode(node) {
    node.close()
  }

  selectNode(nodePath) {
    this.selectedPath = nodePath
  }
}

export default alt.createStore(TreeStore, "TreeStore")
