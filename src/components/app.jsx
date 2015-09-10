import React from "react"
import BaseComponent from "./base_component"
import ApplicationMenu from "../menus/application_menu"
import Tree from "./tree"
import Workspace from "./workspace"

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
  }

  getStoreState() {
    return {
      tree        : this.context.flux.getStore("TreeStore").getState(),
      bufferStore : this.context.flux.getStore("BufferStore").getState()
    }
  }

  handleChange() {
    this.setState(this.getStoreState())
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
