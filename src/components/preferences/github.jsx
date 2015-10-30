import React from "react"
import BaseComponent from "../base_component"
import Panel from "./panel"
import classNames from "classnames"
import FormMenu from "../../menus/form_menu"

export default class GithubPreferences extends BaseComponent {
  handleSignin(e) {
    e.preventDefault()
    this.context.flux.getActions("PrefActions").signin({
      email    : this.refs.email.value,
      password : this.refs.password.value
    })
  }

  handleSignout() {
    this.context.flux.getActions("PrefActions").signout()
  }

  showMenu() {
    if (!this.menu) {
      this.menu = new FormMenu()
    }
    this.menu.show()
  }

  buttonClasses() {
    return classNames("o-button", {
      "o-button--waiting": this.props.prefs.get("waiting")
    })
  }

  render() {
    let panelContent

    if (this.props.prefs.get("username")) {
      panelContent = (
        <div className="o-pref-panel__content">
          <div className="o-user-card">
            <h3 className="o-user-card__name">{this.props.prefs.get("name")}</h3>
            <p className="o-user-card__username">{this.props.prefs.get("username")}</p>
            <img className="o-user-card__avatar" src={this.props.prefs.get("avatar_url")}/>
          </div>

          <button className={this.buttonClasses()} onClick={this.handleSignout.bind(this)}>Sign out</button>
        </div>
      )
    } else {
      panelContent = (
        <form className="o-pref-panel__content" onSubmit={this.handleSignin.bind(this)}>
          <label className="o-form__label">
            Email address
            <input ref="email"
                   className="o-form__text-input"
                   type="email"
                   defaultValue={this.props.prefs.get("email")}
                   required="required"
                   onContextMenu={this.showMenu.bind(this)}/>
          </label>

          <label className="o-form__label">
            Password
            <input ref="password"
                   className="o-form__text-input"
                   type="password"
                   required="required"
                   onContextMenu={this.showMenu.bind(this)}/>
          </label>

          <button className={this.buttonClasses()}>Connect</button>
        </form>
      )
    }

    return (
      <Panel title="GitHub account" iconClassName="octicon-mark-github">
        {panelContent}
      </Panel>
    )
  }
}
