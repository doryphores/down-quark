export default class PrefStore {
  static displayName = "PrefStore"

  constructor() {
    this.state = {
      open: false,

      github_name: "",
      github_username: "",
      github_email: ""
    }

    const PrefActions = this.alt.getActions("PrefActions")

    this.bindListeners({
      togglePanel : PrefActions.TOGGLE_PANEL,
      signin      : PrefActions.SIGNIN,
      signout     : PrefActions.SIGNOUT,
    })
  }

  togglePanel() {
    this.setState({
      open: !this.state.open
    })
  }

  signin(data) {
    this.setState({
      github_username: data.username
    })
  }

  signout() {
    this.setState({
      github_name: "",
      github_username: "",
      github_email: ""
    })
  }
}
