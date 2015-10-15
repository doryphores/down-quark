import _ from "underscore"

export default class PrefStore {
  static displayName = "PrefStore"

  static defaultState = {
    open: false,

    editor_theme: "downquark-dark",
    editor_font_size: 14,

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
      increaseFontSize : PrefActions.INCREASE_FONT_SIZE,
      decreaseFontSize : PrefActions.DECREASE_FONT_SIZE,
      resetFontSize    : PrefActions.RESET_FONT_SIZE,
      switchTheme      : PrefActions.SWITCH_THEME,
      togglePanel      : PrefActions.TOGGLE_PANEL,
      signin           : PrefActions.SIGNIN_SUCCESS,
      signout          : PrefActions.SIGNOUT,
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

  resetFontSize() {
    this.setState({
      editor_font_size: PrefStore.defaultState.editor_font_size
    })
  }

  increaseFontSize() {
    this.setState({
      editor_font_size: this.state.editor_font_size + 1
    })
  }

  decreaseFontSize() {
    if (this.state.editor_font_size == 10) {
      e.preventDefault()
      return
    }
    this.setState({
      editor_font_size: this.state.editor_font_size - 1
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
