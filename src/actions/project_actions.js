import Dialogs from "../utils/dialogs"

export default class ProjectActions {
  reload() {
    this.dispatch()
  }

  open() {
    // TODO: this triggers a warning as dispatch is deferred
    Dialogs.selectFolder().then((folderPath) => {
      this.alt.actions.TabActions.closeAll().then(() => {
        this.dispatch(folderPath)
      })
    })
  }
}
