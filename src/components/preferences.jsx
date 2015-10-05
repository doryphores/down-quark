import React from "react"
import classNames from "classnames"
import BaseComponent from "./base_component"
import GithubPreferences from "./preferences/github"

export default class Preferences extends BaseComponent {
  componentDidUpdate(prevProps, prevState) {
    // Move focus on the panel when opened
    if (!prevProps.prefStore.open && this.props.prefStore.open) {
      React.findDOMNode(this).focus()
    }
  }

  overlayClassNames() {
    return classNames("o-overlay", {
      "o-overlay--is-open": this.props.prefStore.open
    })
  }

  render() {
    return (
      <div className={this.overlayClassNames()} tabIndex="-1">
        <div className="c-pref-panel">
          <h1>
            <i className="octicon octicon-settings"/>
            Preferences
          </h1>

          <GithubPreferences prefs={this.props.prefStore}/>
        </div>
      </div>
    )
  }
}
