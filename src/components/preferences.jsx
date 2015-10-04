import React from "react"
import classNames from "classnames"
import BaseComponent from "./base_component"
import GithubPreferences from "./preferences/github"

export default class Preferences extends BaseComponent {
  overlayClassNames() {
    return classNames("o-overlay", {
      "o-overlay--is-open": this.props.prefStore.open
    })
  }

  render() {
    return (
      <div className={this.overlayClassNames()}>
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
