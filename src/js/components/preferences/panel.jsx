import React from "react"
import classNames from "classnames"

export default class Panel extends React.Component {
  render() {
    return (
      <div className="o-pref-panel">
        <h2 className="o-pref-panel__title">
          <i className={this.props.iconClassName}/>
          {this.props.title}
        </h2>
        {this.props.children}
      </div>
    )
  }
}
