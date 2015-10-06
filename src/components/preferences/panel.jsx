import React from "react"
import classNames from "classnames"

export default class Panel {
  render() {
    return (
      <div className="o-pref-panel">
        <h2 className="o-pref-panel__title">
          <i className={classNames("octicon", this.props.iconClassName)}/>
          {this.props.title}
        </h2>
        {this.props.children}
      </div>
    )
  }
}
