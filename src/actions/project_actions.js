import Dialogs from "../utils/dialogs"

export default class ProjectActions {
  reload() {
    this.dispatch()
  }

  open(folderPath) {
    Dialogs.selectFolder().then((folderPath) => this.dispatch(folderPath))
  }
}
