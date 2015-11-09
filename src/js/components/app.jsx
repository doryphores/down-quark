import React from "react"
import BaseComponent from "./base_component"
import ApplicationMenu from "../menus/application_menu"
import Tree from "./tree"
import Workspace from "./workspace"
import Preferences from "./preferences"
import StatusBar from "./status_bar"
import remote from "remote"
import connectToStores from "alt/utils/connectToStores"

@connectToStores
export default class App extends BaseComponent {
  static getStores(props, context) {
    return [
      context.flux.stores.TreeStore,
      context.flux.stores.BufferStore,
      context.flux.stores.PrefStore,
      context.flux.stores.GitStore
    ]
  }

  static getPropsFromStores(props, context) {
    return {
      gitStore    : context.flux.stores.GitStore.getState(),
      prefStore   : context.flux.stores.PrefStore.getState(),
      treeStore   : context.flux.stores.TreeStore.getState(),
      bufferStore : context.flux.stores.BufferStore.getState()
    }
  }

  componentDidMount() {
    // TODO: is this the right place to set the app menu?
    new ApplicationMenu(this.context.flux)
    this.updateTitle()
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: find a way to simplify this logic (move it to the store?)
    let activeBuffer, prevActiveBuffer
    if (this.props.bufferStore.activeBufferIndex > -1) {
      activeBuffer = this.props.bufferStore.buffers[this.props.bufferStore.activeBufferIndex]
      prevActiveBuffer = prevProps.bufferStore.buffers[prevProps.bufferStore.activeBufferIndex]
    }
    if (
      prevProps.bufferStore.activeBufferIndex != this.props.bufferStore.activeBufferIndex ||
      activeBuffer && activeBuffer.name != prevActiveBuffer.name
    ) {
      this.updateTitle()
    }
  }

  updateTitle() {
    const win = remote.getCurrentWindow()
    const activeBuffer = this.context.flux.stores.BufferStore.getBuffer()
    let title = remote.require("app").getName()

    if (activeBuffer) {
      if (activeBuffer.filePath) {
        win.setRepresentedFilename(activeBuffer.filePath)
      }
      title = `${activeBuffer.name} - ${title}`
    }

    win.setTitle(title)
  }

  render() {
    return (
      <div className="u-container u-container--vertical">
        <StatusBar className="u-panel" gitStore={this.props.gitStore}/>
        <div className="u-panel--grow u-container u-container--horizontal">
          <Tree className="u-panel" treeStore={this.props.treeStore}/>
          <Workspace className="u-panel u-panel--grow"
                     bufferStore={this.props.bufferStore}
                     prefs={this.props.prefStore}/>
                   <Preferences prefStore={this.props.prefStore}/>
        </div>
      </div>
    )
  }
}
