import React from "react"
import ApplicationMenu from "../menus/application_menu"
import SnapshotManager from "../utils/snapshot_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import BufferStore from "../stores/buffer_store"
import ProjectActions from "../actions/project_actions"
import Tree from "./tree"
import Workspace from "./workspace"

@connectToStores
export default class App extends React.Component {
  static getStores() {
    return [TreeStore, BufferStore]
  }

  static getPropsFromStores() {
    return {
      tree   : TreeStore.getState(),
      bufferStore : BufferStore.getState()
    }
  }

  componentDidMount() {
    // TODO: is this the right place to set the app menu?
    new ApplicationMenu()
    SnapshotManager.restore(ProjectActions.reload)
  }

  componentDidUpdate() {
    SnapshotManager.save()
  }

  render() {
    return (
      <div className="u-container u-container--horizontal">
        <Tree className="u-panel" tree={this.props.tree}/>
        <Workspace className="u-panel u-panel--grow"
                   bufferStore={this.props.bufferStore}/>
      </div>
    )
  }
}
