import React from "react"
import ShortcutManager from "../utils/shortcut_manager"
import connectToStores from "alt/utils/connectToStores"
import TreeStore from "../stores/tree_store"
import EditorStore from "../stores/editor_store"
import FileSystemActions from "../actions/file_system_actions"
import Tree from "./tree"
import TabBar from "./tab_bar"
import Editor from "./editor"
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
      <div className="u-container  u-container--horizontal">
        <Tree tree={this.props.tree}/>

        <div className="u-container  u-container--vertical  u-panel  u-panel--grow">
          <TabBar editors={this.props.editors}/>

          <div className="c-editors  u-panel  u-panel--grow">
            {this.props.editors.map((editor) => {
              return <Editor key={editor.path} editor={editor}/>
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default connectToStores(App)
