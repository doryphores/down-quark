import alt from "../alt"
import fs from "fs-extra"
import path from "path"
import _ from "underscore"
import ProjectActions from "../actions/project_actions"

class ProjectStore {
  static displayName = "ProjectStore"

  constructor() {
    this.state = {
      rootPath: "",
      contentPath: "",
      mediaPath: "",
      shortcuts: {}
    }

    this.bindListeners({
      setRoot    : ProjectActions.OPEN,
      loadConfig : ProjectActions.RELOAD
    })
  }

  setRoot(rootPath) {
    this.state.rootPath = rootPath
    this.state.contentPath = rootPath
    this.state.mediaPath = rootPath
    this.loadConfig()
  }

  loadConfig() {
    let configFile = path.join(this.state.rootPath, "downquark_config.json")
    let config = fs.readJSONSync(configFile, { throws: false })
    if (config) {
      this.setState({
        contentPath: path.join(this.state.rootPath, config.contentPath || ""),
        mediaPath: path.join(this.state.rootPath, config.mediaPath || ""),
        shortcuts: _.mapObject(config.shortcuts || {}, (p, alias) => {
          return path.join(this.state.rootPath, p)
        })
      })
    }
  }
}

export default alt.createStore(ProjectStore)
