import React from "react"
import BaseComponent from "../base_component"
import classNames from "classnames"

export default class GithubPreferences extends BaseComponent {
  handleSignin(e) {
    e.preventDefault()
    this.context.flux.getActions("PrefActions").signin({
      username: React.findDOMNode(this.refs.username).value,
      password: React.findDOMNode(this.refs.password).value
    })
  }

  handleSignout() {
    this.context.flux.getActions("PrefActions").signout()
  }

  render() {
    if (this.props.prefs.github_username) {
      return (
        <div>
          <h2>
            <i className="octicon octicon-mark-github"/>
            GitHub account
          </h2>

          <div className="o-user-card">
            <h3 className="o-user-card__name">{this.props.prefs.github_name}</h3>
            <p className="o-user-card__username">{this.props.prefs.github_username}</p>
          </div>

          <button onClick={this.handleSignout.bind(this)}>Sign out</button>
        </div>
      )
    } else {
      return (
        <div>
          <h2>
            <i className="octicon octicon-mark-github"/>
            GitHub account
          </h2>

          <form onSubmit={this.handleSignin.bind(this)}>
            <label>
              Username
              <input ref="username" type="text" defaultValue={this.props.prefs.github_username} required/>
            </label>

            <label>
              Password
              <input ref="password" type="password" required/>
            </label>

            <button>Connect</button>
          </form>
        </div>
      )
    }
  }
}
