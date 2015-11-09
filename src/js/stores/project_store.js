import fs from "fs-extra"
import path from "path"
import _ from "underscore"

export default class ProjectStore {
  static displayName = "ProjectStore"

  constructor() {
    this.state = {
      rootPath: "",
      contentPath: "",
      mediaPath: "",
      shortcuts: {}
    }

    const ProjectActions = this.alt.actions.ProjectActions

    this.bindListeners({
      setRoot: ProjectActions.OPEN
    })
  }

  setRoot(rootPath) {
    this.setState({
      rootPath    : rootPath,
      contentPath : rootPath,
      mediaPath   : rootPath,
      shortcuts   : {}
    })
    this.loadConfig()
  }

  loadConfig() {
    let configFile = path.join(this.state.rootPath, "downquark_config.json")
    if (!fs.existsSync(configFile)) return
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
