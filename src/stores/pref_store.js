import _ from "underscore"

export default class PrefStore {
  static displayName = "PrefStore"

  static defaultState = {
    open: false,

    editor_theme: "downquark-dark",
    editor_font_size: 12,

    github_waiting: false,
    github_name: "",
    github_username: "",
    github_email: "",
    github_avatar_url: ""
  }

  constructor() {
    this.state = Object.assign({}, PrefStore.defaultState)

    // Reset all transient states
    this.on("bootstrap", () => {
      _.defaults(this.state, PrefStore.defaultState)
      this.setState({
        github_waiting: false
      })
    })

    const PrefActions = this.alt.getActions("PrefActions")

    this.bindListeners({
      switchTheme : PrefActions.SWITCH_THEME,
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

  switchTheme() {
    this.setState({
      editor_theme: this.state.editor_theme == "downquark-dark" ? "downquark-light" : "downquark-dark"
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
