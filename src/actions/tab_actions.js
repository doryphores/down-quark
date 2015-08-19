import alt from "../alt"

class TabActions {
  selectTab(filePath) {
    this.dispatch(filePath)
  }
}

export default alt.createActions(TabActions)
