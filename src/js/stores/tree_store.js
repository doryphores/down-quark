import _ from "underscore"
import remote from "remote"
import fs from "fs-extra"
import RootNode from "../models/root_node"

export default class TreeStore {
  static displayName = "TreeStore"

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
        root: new RootNode(data.rootPath, {
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

    const ProjectActions = this.alt.actions.ProjectActions
    const TreeActions = this.alt.actions.TreeActions

    this.bindListeners({
      setRoot      : [
                       ProjectActions.OPEN,
                       ProjectActions.RELOAD
                     ],
      expandNode   : TreeActions.EXPAND,
      collapseNode : TreeActions.COLLAPSE,
      selectNode   : TreeActions.SELECT,
      deleteNode   : TreeActions.DELETE,
      moveNode     : TreeActions.MOVE
    })

    // When the store is bootstrapped, we need to reload the root node
    // from the restored root path
    this.on("bootstrap", this.listenForChanges.bind(this))

    this.exportPublicMethods({
      getRootPath: this.getRootPath.bind(this)
    })
  }

  getRootPath() {
    return this.state.root && this.state.root.path
  }

  setRoot() {
    const ProjectStore = this.alt.stores.ProjectStore

    this.waitFor(ProjectStore)

    let rootPath = ProjectStore.getState().contentPath

    if (this.state.root && this.state.root.path == rootPath) return

    if (this.state.root) {
      // Clean up previous tree root
      this.state.root.unwatch()
      delete this.state.root
    }

    this.setState({
      root: new RootNode(rootPath)
    })

    this.listenForChanges()
  }

  listenForChanges() {
    this.state.root.on("change", _.debounce(this.emitChange.bind(this), 100))
  }

  expandNode(nodePath) {
    this.state.root.expand(nodePath)
  }

  collapseNode(nodePath) {
    this.state.root.collapse(nodePath)
  }

  selectNode(nodePath) {
    this.state.root.changeSelection(nodePath)
  }

  // TODO: move to ProjectStore
  deleteNode(nodePath) {
    // TODO: handle unwatching in file tree object
    this.state.root.findNode(nodePath).unwatch()
    remote.require("shell").moveItemToTrash(nodePath)
  }

  // TODO: move to ProjectStore
  moveNode({nodePath, newPath} = {}) {
    // TODO: handle unwatching in file tree object
    this.state.root.findNode(nodePath).unwatch()
    fs.move(nodePath, newPath, (err) => {
      if (err) console.log(err)
    })
  }
}
