import React from "react"
import BaseComponent from "./base_component"
import BranchSelector from "./status_bar/branch_selector"
import classNames from "classnames"

export default class StatusBar extends BaseComponent {
  render() {
    if (!this.props.gitStore.enabled) return null

    return (
      <div className={classNames("c-status-bar", this.props.className)}>
        <div>
          Current branch:
          <BranchSelector gitStore={this.props.gitStore}/>
        </div>
      </div>
    )
  }
}
