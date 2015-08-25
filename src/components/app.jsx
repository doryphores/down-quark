import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import FileBufferStore from "../stores/file_buffer_store"
import FileSystemActions from "../actions/file_system_actions"
import Tree from "./tree"
import Workspace from "./workspace"
import Settings from "../utils/settings"

class App extends React.Component {
  static getStores() {
    return [TreeStore, FileBufferStore]
  }

  static getPropsFromStores() {
    return {
      tree        : TreeStore.getState(),
      fileBuffers : FileBufferStore.getState()
    }
  }

  componentDidMount() {
    ShortcutManager.registerCommands()
    if (Settings.get("treeState")) {
      FileSystemActions.openFolder.defer(Settings.get("treeState"))
    }
  }

  componentWillUnmount() {
    ShortcutManager.unregisterCommands()
  }

  componentDidUpdate() {
    Settings.set("treeState", {
      rootPath      : this.props.tree.root.path,
      expandedPaths : this.props.tree.expandedPaths
    })
  }

  render() {
    return (
      <div className="u-container u-container--horizontal">
        <Tree className="u-panel" tree={this.props.tree}/>
        <Workspace className="u-panel u-panel--grow"
                   fileBuffers={this.props.fileBuffers}/>
      </div>
    )
  }
}

export default connectToStores(App)
