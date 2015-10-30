import React from "react"
import BaseComponent from "../base_component"
import Panel from "./panel"
import classNames from "classnames"

export default class GithubPreferences extends BaseComponent {
  handleThemeChange(e) {
    this.context.flux.getActions("PrefActions").switchTheme()
  }

  render() {
    return (
      <Panel title="General settings" iconClassName="octicon-settings">
        <div className="o-pref-panel__content">
          <div className="o-form-label">
            Editor theme
          </div>
          <label className="o-form-radio">
            <input type="radio"
                   name="editor_theme"
                   checked={this.props.prefs.getIn(["editor", "theme"]) == "downquark-dark"}
                   onChange={this.handleThemeChange.bind(this)}/>
            Dark theme
          </label>
          <label className="o-form-radio">
            <input type="radio"
                   name="editor_theme"
                   checked={this.props.prefs.getIn(["editor", "theme"]) == "downquark-light"}
                   onChange={this.handleThemeChange.bind(this)}/>
            Light theme
          </label>
        </div>
      </Panel>
    )
  }
}
