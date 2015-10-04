export default class PrefActions {
  togglePanel() {
    this.dispatch()
  }

  signin(data) {
    this.dispatch(data)
  }

  signout() {
    this.dispatch()
  }
}
