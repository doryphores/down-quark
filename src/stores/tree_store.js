import alt from "../alt"
import _ from "underscore"
import remote from "remote"
import FileSystemActions from "../actions/file_system_actions"
import FileTree from "../utils/file_tree"
import TreeActions from "../actions/tree_actions"

class TreeStore {
  static config = {
    onSerialize: (data) => {
      return {
        rootPath      : data.root.path,
        selectedPath  : data.selectedPath,
        expandedPaths : data.expandedPaths
      }
    },

    onDeserialize: (data) => {
      return {
        rootPath      : data.rootPath,
        selectedPath  : data.selectedPath,
        expandedPaths : data.expandedPaths
      }
    }
  }

  constructor() {
    this.rootPath = ""
    this.root = null
    this.selectedPath = null
    this.expandedPaths = []

    this.bindListeners({
      openFolder   : FileSystemActions.OPEN_FOLDER,
      expandNode   : TreeActions.EXPAND,
      collapseNode : TreeActions.COLLAPSE,
      selectNode   : TreeActions.SELECT,
      deleteNode   : FileSystemActions.DELETE
    })

    // When the store is bootstrapped, we need to reload the root node
    // from the restored root path
    this.on("bootstrap", this.setRoot.bind(this))

    this.exportPublicMethods({
      getRootPath : this.getRootPath.bind(this)
    })
  }

  getRootPath() {
    return this.rootPath
  }

  setRoot() {
    this.root = new FileTree(this.rootPath)
    this.root.on("change", this.emitChange.bind(this))

    // Expand root by default
    if (this.expandedPaths.length === 0) {
      this.expandedPaths = [this.rootPath]
    }

    // Restore expanded nodes
    this.expandedPaths = _.compact(this.expandedPaths.sort().map((p) => {
      let n = this.root.findNode(p)
      if (!n) return false
      n.open()
      return p
    }))
  }

  openFolder(rootPath) {
    // Stop watching file system if a previous folder was open
    if (this.root) this.root.unwatch()

    this.rootPath = rootPath
    this.selectedPath = null
    this.expandedPaths = []

    this.setRoot()
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

  deleteNode(nodePath) {
    remote.require("shell").moveItemToTrash(nodePath)
    this.preventDefault()
  }
}

export default alt.createStore(TreeStore, "TreeStore")
