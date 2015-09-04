import alt from "../alt"
import remote from "remote"
import Dialogs from "../utils/dialogs"

class ProjectActions {
  reload() {
    this.dispatch()
  }

  open(folderPath) {
    Dialogs.selectFolder().then((folderPath) => this.dispatch(folderPath))
  }
}

export default alt.createActions(ProjectActions)
