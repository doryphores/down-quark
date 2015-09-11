import React from "react"
import BaseComponent from "./base_component"
import ApplicationMenu from "../menus/application_menu"
import Tree from "./tree"
import Workspace from "./workspace"
import remote from "remote"
import path from "path"

export default class App extends BaseComponent {
  constructor(props, context) {
    super(props, context)
    this.state = this.getStoreState()
  }

  componentDidMount() {
    this.context.flux.getStore("TreeStore").listen(this.handleChange.bind(this))
    this.context.flux.getStore("BufferStore").listen(this.handleChange.bind(this))

    // TODO: is this the right place to set the app menu?
    new ApplicationMenu(this.context.flux)
    this.updateTitle()
  }

  getStoreState() {
    return {
      tree        : this.context.flux.getStore("TreeStore").getState(),
      bufferStore : this.context.flux.getStore("BufferStore").getState()
    }
  }

  handleChange() {
    this.setState(this.getStoreState())
    this.updateTitle()
  }

  updateTitle() {
    const win = remote.getCurrentWindow()
    const activeBuffer = this.context.flux.getStore("BufferStore").getBuffer()
    let title = remote.require("app").getName()

    if (activeBuffer) {
      if (activeBuffer.filePath) {
        win.setRepresentedFilename(activeBuffer.filePath)
        title = `${activeBuffer.name} - ${path.dirname(activeBuffer.filePath)} - ${title}`
      } else {
        title = `${activeBuffer.name} - ${title}`
      }
    }

    win.setTitle(title)
  }

  render() {
    return (
      <div className="u-container u-container--horizontal">
        <Tree className="u-panel" tree={this.state.tree}/>
        <Workspace className="u-panel u-panel--grow"
                   bufferStore={this.state.bufferStore}/>
      </div>
    )
  }
}
