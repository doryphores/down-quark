import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import SnapshotManager from "../utils/snapshot_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import FileBufferStore from "../stores/file_buffer_store"
import FileSystemActions from "../actions/file_system_actions"
import Tree from "./tree"
import Workspace from "./workspace"

@connectToStores
export default class App extends React.Component {
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
    SnapshotManager.restore()
  }

  componentWillUnmount() {
    ShortcutManager.unregisterCommands()
  }

  componentDidUpdate() {
    SnapshotManager.save()
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
