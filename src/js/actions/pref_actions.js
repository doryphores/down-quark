import GitHub from "../utils/github"

export default class PrefActions {
  togglePanel() {
    this.dispatch()
  }

  switchTheme() {
    this.dispatch()
  }

  increaseFontSize() {
    this.dispatch()
  }

  decreaseFontSize() {
    this.dispatch()
  }

  resetFontSize() {
    this.dispatch()
  }

  signin(data) {
    const github = new GitHub()
    this.dispatch()
    github.setup(data.email, data.password, (err, details) => {
      if (err) this.actions.signinFailed(err)
      else {
        this.actions.signinSuccess(details)
      }
    })
  }

  signinFailed(err) {
    this.dispatch(err)
  }

  signinSuccess(details) {
    this.dispatch(details)
  }

  signout() {
    this.dispatch()
  }
}
