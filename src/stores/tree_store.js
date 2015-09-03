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
        selectedPath  : data.root.getSelectedPath(),
        expandedPaths : data.root.getExpandedPaths()
      }
    },

    onDeserialize: (data) => {
      return {
        root: new FileTree(data.rootPath, {
          expandedPaths: data.expandedPaths,
          selectedPath : data.selectedPath
        })
      }
    },

    getState: (currentState) => {
      return {
        root: currentState.root && currentState.root.memo()
      }
    }
  }

  constructor() {
    this.state = { root: null }

    this.bindListeners({
      setRoot      : FileSystemActions.OPEN_FOLDER,
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
      getRootPath: this.getRootPath.bind(this)
    })
  }

  getRootPath() {
    return this.state.root && this.state.root.path
  }

  setRoot(rootPath) {
    if (rootPath) {
      // Stop watching file system if a previous folder was open
      if (this.state.root) this.state.root.unwatch()
      delete this.state.root
      this.state.root = new FileTree(rootPath)
    }

    this.state.root.on("change", _.debounce(this.emitChange.bind(this), 100))
  }

  expandNode(nodePath) {
    this.state.root.findNode(nodePath).open()
  }

  collapseNode(nodePath) {
    this.state.root.findNode(nodePath).close()
  }

  selectNode(nodePath) {
    this.state.root.changeSelection(nodePath)
  }

  deleteNode(nodePath) {
    this.state.root.findNode(nodePath).unwatch()
    remote.require("shell").moveItemToTrash(nodePath)
  }

  moveNode({nodePath, newPath} = {}) {
    this.state.root.findNode(nodePath).unwatch()
    fs.move(nodePath, newPath, {})
  }
}

export default alt.createStore(TreeStore, "TreeStore")
