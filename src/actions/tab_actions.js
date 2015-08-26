import alt from "../alt"

class TabActions {
  selectTab(tabIndex) {
    this.dispatch(tabIndex)
  }
}

export default alt.createActions(TabActions)
