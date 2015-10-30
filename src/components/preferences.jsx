import React from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"
import BaseComponent from "./base_component"
import GeneralPreferences from "./preferences/general"
import GithubPreferences from "./preferences/github"

export default class Preferences extends BaseComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.prefStore !== nextProps.prefStore
  }

  componentDidUpdate(prevProps, prevState) {
    // Move focus on the panel when opened
    if (!prevProps.prefStore.get("open") && this.props.prefStore.get("open")) {
      ReactDOM.findDOMNode(this).focus()
    }
  }

  overlayClassNames() {
    return classNames("o-overlay u-container u-container--vertical c-preferences", {
      "o-overlay--is-open": this.props.prefStore.get("open")
    })
  }

  render() {
    return (
      <div className={this.overlayClassNames()} tabIndex="-1">
        <h1 className="o-overlay__title u-panel">
          <i className="octicon-tools"/>
          Preferences
        </h1>

        <div className="o-overlay__content u-panel--grow">
          <GeneralPreferences prefs={this.props.prefStore}/>
          <GithubPreferences prefs={this.props.prefStore.get("github")}/>
        </div>
      </div>
    )
  }
}
