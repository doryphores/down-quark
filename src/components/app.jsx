import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import EditorStore from "../stores/editor_store"
import FileSystemActions from "../actions/file_system_actions"
import Tree from "./tree"
import Workspace from "./workspace"
import Settings from "../utils/settings"

class App extends React.Component {
  static getStores() {
    return [TreeStore, EditorStore]
  }

  static getPropsFromStores() {
    return {
      tree     : TreeStore.getState(),
      editors  : EditorStore.getState().editors
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
        <Workspace className="u-panel u-panel--grow" editors={this.props.editors}/>
      </div>
    )
  }
}

export default connectToStores(App)
