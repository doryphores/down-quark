import Alt from "alt"
import remote from "remote"
import fs from "fs-extra"
import path from "path"
import _ from "underscore"

import ProjectStore from "./stores/project_store"
import TreeStore from "./stores/tree_store"
import BufferStore from "./stores/buffer_store"
import PrefStore from "./stores/pref_store"

import ProjectActions from "./actions/project_actions"
import TreeActions from "./actions/tree_actions"
import TabActions from "./actions/tab_actions"
import BufferActions from "./actions/buffer_actions"
import PrefActions from "./actions/pref_actions"

const app = remote.require("app")

const SNAPSHOT_FILE = path.join(
  app.getPath("appData"),
  app.getName(),
  "snapshot.json"
)

export default class Flux extends Alt {
  constructor(config = {}) {
    super(config)

    this.addActions("ProjectActions", ProjectActions)
    this.addActions("TreeActions", TreeActions)
    this.addActions("TabActions", TabActions)
    this.addActions("BufferActions", BufferActions)
    this.addActions("PrefActions", PrefActions)

    this.createStore(ProjectStore)
    this.createStore(TreeStore)
    this.createStore(BufferStore)
    this.createStore(PrefStore)

    // Restore previous store state
    this.restoreSnapshot()

    // Debounce the saveSnapshot method to optimise disk writes
    const saveSnapshot = _.debounce(this.saveSnapshot.bind(this), 200)

    // Save a snapshot every time a store changes
    for (let store in this.stores) this.stores[store].listen(saveSnapshot)
  }

  saveSnapshot() {
    fs.outputFile(SNAPSHOT_FILE, this.takeSnapshot())
  }

  restoreSnapshot() {
    if (fs.existsSync(SNAPSHOT_FILE)) {
      try {
        this.bootstrap(fs.readFileSync(SNAPSHOT_FILE, "utf-8"))
      } catch(e) {
        // Log the error but carry on as normal. This could be due
        // to a corrupt or incompatible snapshot file
        console.error("An error occurred while restoring snapshot:", e)
      }
    }
  }
}
