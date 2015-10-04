export default class PrefStore {
  static displayName = "PrefStore"

  constructor() {
    this.state = {
      open: false,

      github_name: "",
      github_username: "",
      github_email: "",
      github_avatar_url: ""
    }

    const PrefActions = this.alt.getActions("PrefActions")

    this.bindListeners({
      togglePanel : PrefActions.TOGGLE_PANEL,
      signin      : PrefActions.SIGNIN_SUCCESS,
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
