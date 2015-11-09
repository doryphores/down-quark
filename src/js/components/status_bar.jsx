import React from "react"
import BaseComponent from "./base_component"
import BranchSelector from "./status_bar/branch_selector"
import classNames from "classnames"

export default class StatusBar extends BaseComponent {
  componentClassNames() {
    return classNames("c-status-bar", this.props.className, {
      "c-status-bar--working": this.props.gitStore.working
    })
  }

  render() {
    if (!this.props.gitStore.enabled) return null

    return (
      <div className={this.componentClassNames()}>
        <div>
          Current branch:
          <BranchSelector gitStore={this.props.gitStore}/>
          <span className="c-status-bar__working-indicator">Working&hellip;</span>
        </div>
      </div>
    )
  }
}
