import Dialogs from "../utils/dialogs"

export default class ProjectActions {
  reload() {
    this.dispatch()
  }

  open() {
    Dialogs.selectFolder().then((folderPath) => {
      this.alt.getActions("TabActions").closeAll().then(() => {
        this.dispatch(folderPath)
      })
    })
  }
}
