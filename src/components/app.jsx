import remote from "remote"
import alt from "../alt"
import fs from "fs-extra"
import path from "path"
import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import FileBufferStore from "../stores/file_buffer_store"
import FileSystemActions from "../actions/file_system_actions"
import Tree from "./tree"
import Workspace from "./workspace"
import Settings from "../utils/settings"

const _cacheFile = path.join(remote.require("app").getPath("appData"),
  "DownQuark", "snapshot.json")

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

    // TODO: not sure this is the best place for this
    // Attempt to read the snapshot file
    fs.readFile(_cacheFile, {
      encoding: "utf-8"
    }, (err, snapshot) => {
      if (err) return
      // We have a saved snapshot so bootstrap the stores
      alt.bootstrap(snapshot)
    })
  }

  componentWillUnmount() {
    ShortcutManager.unregisterCommands()
  }

  componentDidUpdate() {
    // TODO: not entierly sure this should go here but seems to be best place
    // to take and save snapshots
    fs.outputFile(_cacheFile, alt.takeSnapshot())
    console.log("SNAPSHOT")
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
