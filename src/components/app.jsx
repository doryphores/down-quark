import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import Tree from "./tree"


class App extends React.Component {
  static getStores() {
    return [TreeStore]
  }

  static getPropsFromStores() {
    return {
      tree: TreeStore.getState(),
    }
  }

  componentDidMount() {
    ShortcutManager.registerCommands()
  }

  componentWillUnmount() {
    ShortcutManager.unregisterCommands()
  }

  render() {
    return (
      <div className="u-container  u-container--horizontal">
        <Tree root={this.props.tree.root}
              selectedPath={this.props.tree.selectedPath}/>

        <div className="u-panel  c-workspace">
          <h2>Workspace</h2>
        </div>
      </div>
    )
  }
}

export default connectToStores(App)
