import React from "react"
import classNames from "classnames"
import TabActions from "../actions/tab_actions"
import FileSystemActions from "../actions/file_system_actions"

export default class TabBar extends React.Component {
  tabClasses(buffer) {
    return classNames("c-tab-bar__item", {
      "c-tab-bar__item--active" : buffer.active,
      "c-tab-bar__item--dirty"  : !buffer.clean
    })
  }

  handleClick(filePath, event) {
    if (event.target.classList.contains("js-close")) {
      FileSystemActions.closeFile(filePath)
    } else {
      TabActions.selectTab(filePath)
    }
  }

  render() {
    if (this.props.fileBuffers.count === 0) return null

    return(
      <ul className={classNames(this.props.className, "c-tab-bar")}>
        {this.props.fileBuffers.buffers.map((buffer, index) => {
          return (
            <li key={"tab-" + index}
                className={this.tabClasses(buffer)}
                onClick={this.handleClick.bind(this, index)}>
              <span>{buffer.name}</span>
              <span className="c-tab-bar__close  js-close"/>
            </li>
          )
        })}
      </ul>
    )
  }
}
