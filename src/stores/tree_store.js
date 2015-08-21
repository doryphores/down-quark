import alt from "../alt"
import _ from "underscore"
import FileSystemActions from "../actions/file_system_actions"
import FileTree from "../utils/file_tree"
import TreeActions from "../actions/tree_actions"

class TreeStore {
  constructor() {
    this.root = null
    this.selectedPath = null
    this.expandedPaths = []

    this.bindListeners({
      openFolder   : FileSystemActions.OPEN_FOLDER,
      expandNode   : TreeActions.EXPAND,
      collapseNode : TreeActions.COLLAPSE,
      selectNode   : TreeActions.SELECT
    })
  }

  openFolder(treeState) {
    // Stop watching file system if a previous folder was open
    if (this.root) this.root.unwatch()

    this.selectedPath = null

    this.root = new FileTree(treeState.rootPath)
    this.root.on("change", this.emitChange.bind(this))

    this.expandedPaths = treeState.expandedPaths || []

    // Expand root by default
    if (this.expandedPaths.length === 0) {
      this.expandedPaths = [treeState.rootPath]
    }

    this.expandedPaths = _.compact(this.expandedPaths.sort().map((p) => {
      let n = this.root.findNode(p)
      if (!n) return false
      n.open()
      return p
    }))
  }

  expandNode(node) {
    node.open()
    if (this.expandedPaths.indexOf(node.path) === -1) {
      this.expandedPaths.push(node.path)
    }
  }

  collapseNode(node) {
    node.close()
    this.expandedPaths = _.without(this.expandedPaths, node.path)
  }

  selectNode(nodePath) {
    this.selectedPath = nodePath
  }
}

export default alt.createStore(TreeStore, "TreeStore")
