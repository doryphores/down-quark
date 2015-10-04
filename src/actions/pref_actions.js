import GitHub from "../utils/github"

export default class PrefActions {
  togglePanel() {
    this.dispatch()
  }

  signin(data) {
    const github = new GitHub()
    this.dispatch()
    github.setup(data.username, data.password, (err, details) => {
      if (err) this.actions.signinFailed(err)
      else {
        this.actions.signinSuccess(details)
      }
    })
  }

  signinFailed(err) {
    console.log(err)
  }

  signinSuccess(details) {
    this.dispatch(details)
  }

  signout() {
    this.dispatch()
  }
}
