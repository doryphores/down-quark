import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import EditorStore from "../stores/editor_store"
import Tree from "./tree"
import TabBar from "./tab_bar"
import EditorPanes from "./editor_panes"

class App extends React.Component {
  static getStores() {
    return [TreeStore, EditorStore]
  }

  static getPropsFromStores() {
    return {
      tree    : TreeStore.getState(),
      editors : EditorStore.getState().editors
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

        <div className="u-container  u-container--vertical  u-panel  u-panel--grow">
          <TabBar editors={this.props.editors}/>

          <EditorPanes editors={this.props.editors}/>
        </div>
      </div>
    )
  }
}

export default connectToStores(App)
