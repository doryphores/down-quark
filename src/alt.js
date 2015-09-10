import Alt from "alt"

import ProjectStore from "./stores/project_store"
import TreeStore from "./stores/tree_store"
import BufferStore from "./stores/buffer_store"

import ProjectActions from "./actions/project_actions"
import EditorActions from "./actions/editor_actions"
import TreeActions from "./actions/tree_actions"
import TabActions from "./actions/tab_actions"
import FileSystemActions from "./actions/file_system_actions"

export default class Flux extends Alt {
  constructor(config = {}) {
    super(config)

    this.addActions("ProjectActions", ProjectActions)
    this.addActions("TreeActions", TreeActions)
    this.addActions("TabActions", TabActions)
    this.addActions("EditorActions", EditorActions)
    this.addActions("FileSystemActions", FileSystemActions)

    this.createStore(ProjectStore)
    this.createStore(TreeStore)
    this.createStore(BufferStore)
  }
}
