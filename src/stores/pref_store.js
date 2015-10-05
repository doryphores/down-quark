export default class PrefStore {
  static displayName = "PrefStore"

  constructor() {
    this.state = {
      open: false,

      github_waiting: false,
      github_name: "",
      github_username: "",
      github_email: "",
      github_avatar_url: ""
    }

    // Reset all transient states
    this.on("bootstrap", () => {
      this.setState({
        github_waiting: false
      })
    })

    const PrefActions = this.alt.getActions("PrefActions")

    this.bindListeners({
      togglePanel : PrefActions.TOGGLE_PANEL,
      signin      : PrefActions.SIGNIN_SUCCESS,
      signout     : PrefActions.SIGNOUT,
    })

    this.bindAction(PrefActions.SIGNIN, () => {
      this.setState({
        github_waiting: true
      })
    })

    this.bindAction(PrefActions.SIGNIN_FAILED, () => {
      this.setState({
        github_waiting: false
      })
    })
  }

  setInProgress() {
    this.setState({
      github_waiting: true
    })
  }

  togglePanel() {
    this.setState({
      open: !this.state.open
    })
  }

  signin(data) {
    this.setState({
      github_waiting: false,
      github_name: data.name,
      github_username: data.username,
      github_email: data.email,
      github_avatar_url: data.avatar_url
    })
  }

  signout() {
    this.setState({
      github_name: "",
      github_username: "",
      github_email: "",
      github_avatar_url: ""
    })
  }
}
