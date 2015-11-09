import _ from "underscore"
import Immutable from "immutable"

export default class PrefStore {
  static displayName = "PrefStore"

  static config = {
    onSerialize(state) {
      return state.toJS()
    },

    onDeserialize(data) {
      _.defaults(data, PrefStore.defaultState)
      data.open = false
      data.github.waiting = false
      return Immutable.fromJS(data)
    },

    setState(currentState, nextState) {
      this.state = currentState.mergeDeep(nextState)
      return this.state
    },

    getState(currentState) {
      return currentState
    }
  }

  static defaultState = {
    open: false,

    editor: {
      theme: "downquark-dark",
      font_size: 14
    },

    github: {
      waiting: false,
      name: "",
      username: "",
      email: "",
      avatar_url: ""
    }
  }

  constructor() {
    this.state = Immutable.fromJS(PrefStore.defaultState)

    const PrefActions = this.alt.actions.PrefActions

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
        github: {
          waiting: true
        }
      })
    })

    this.bindAction(PrefActions.SIGNIN_FAILED, () => {
      this.setState({
        github: {
          waiting: false
        }
      })
    })
  }

  setInProgress() {
    this.setState({
      github: {
        waiting: true
      }
    })
  }

  togglePanel() {
    this.setState({
      open: !this.state.get("open")
    })
  }

  switchTheme() {
    let currentTheme = this.state.getIn(["editor", "theme"])
    this.setState({
      editor: {
        theme: currentTheme == "downquark-dark" ? "downquark-light" : "downquark-dark"
      }
    })
  }

  resetFontSize() {
    this.setState({
      editor: {
        font_size: PrefStore.defaultState.editor.font_size
      }
    })
  }

  increaseFontSize() {
    this.setState({
      editor: {
        font_size: this.state.getIn(["editor", "font_size"]) + 1
      }
    })
  }

  decreaseFontSize() {
    if (this.state.getIn(["editor", "font_size"]) == 10) {
      this.preventDefault()
      return
    }
    this.setState({
      editor: {
        font_size: this.state.getIn(["editor", "font_size"]) - 1
      }
    })
  }

  signin(data) {
    this.setState({
      github: {
        waiting: false,
        name: data.name,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url
      }
    })
  }

  signout() {
    this.setState({
      github: {
        name: "",
        username: "",
        email: "",
        avatar_url: ""
      }
    })
  }
}
