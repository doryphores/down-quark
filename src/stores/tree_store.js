import alt from "../alt"
import _ from "underscore"
import remote from "remote"
import fs from "fs-extra"
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
    },

    getState: (currentState) => {
      return {
        selectedPath: currentState.selectedPath,
        root: currentState.root && currentState.root.memo()
      }
    }
  }

  constructor() {
    this.state = {
      rootPath      : "",
      expandedPaths : [],
      root          : null,
      selectedPath  : null
    }

    this.bindListeners({
      openFolder   : FileSystemActions.OPEN_FOLDER,
      expandNode   : TreeActions.EXPAND,
      collapseNode : TreeActions.COLLAPSE,
      selectNode   : TreeActions.SELECT,
      deleteNode   : FileSystemActions.DELETE,
      moveNode     : FileSystemActions.MOVE
    })

    // When the store is bootstrapped, we need to reload the root node
    // from the restored root path
    this.on("bootstrap", this.setRoot.bind(this))

    this.exportPublicMethods({
      getRootPath : this.getRootPath.bind(this)
    })
  }

  getRootPath() {
    return this.state.rootPath
  }

  setRoot() {
    this.state.root = new FileTree(this.state.rootPath)
    this.state.root.on("change", _.debounce(this.emitChange.bind(this), 100))

    // Expand root by default
    if (this.state.expandedPaths.length === 0) {
      this.state.expandedPaths = [this.state.rootPath]
    }

    // Restore expanded nodes
    this.state.expandedPaths = _.compact(this.state.expandedPaths.sort().map((p) => {
      let n = this.state.root.findNode(p)
      if (!n) return false
      n.open()
      return p
    }))

    this.state.selectedPath = this.state.root.changeSelection(null,
      this.state.selectedPath)
  }

  openFolder(rootPath) {
    // Stop watching file system if a previous folder was open
    if (this.state.root) this.state.root.unwatch()

    this.state.rootPath = rootPath
    this.state.selectedPath = null
    this.state.expandedPaths = []

    this.setRoot()
  }

  expandNode(nodePath) {
    this.state.root.findNode(nodePath).open()
    if (this.state.expandedPaths.indexOf(nodePath) === -1) {
      this.state.expandedPaths.push(nodePath)
    }
  }

  collapseNode(nodePath) {
    this.state.root.findNode(nodePath).close()
    this.state.expandedPaths = _.without(this.state.expandedPaths, nodePath)
  }

  selectNode(nodePath) {
    if (nodePath == this.state.selectedPath) return
    this.state.selectedPath = this.state.root.changeSelection(
      this.state.selectedPath, nodePath)
  }

  deleteNode(nodePath) {
    remote.require("shell").moveItemToTrash(nodePath)
    this.preventDefault()
  }

  moveNode({nodePath, newPath} = {}) {
    let node = this.state.root.findNode(nodePath)
    if (node.type == "dir") node.unwatch()
    fs.move(nodePath, newPath, {})
    this.preventDefault()
  }
}

export default alt.createStore(TreeStore, "TreeStore")
