import React from "react"
import BaseComponent from "./base_component"
import classNames from "classnames"

export default class StatusBar extends BaseComponent {
  render() {
    return (
      <div className={classNames("c-status-bar", this.props.className)}>
        Current branch: <strong>{this.props.gitStore.currentBranch}</strong> | {this.props.gitStore.status.length} uncommitted changes
      </div>
    )
  }
}
