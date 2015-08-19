import React from "react"
import classNames from "classnames"
import TabActions from "../actions/tab_actions"
import FileSystemActions from "../actions/file_system_actions"

export default class TabBar extends React.Component {
  tabClasses(editor) {
    return classNames("c-tab-bar__item", {
      "c-tab-bar__item--active" : editor.active,
      "c-tab-bar__item--dirty"  : !editor.clean
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
    if (this.props.editors.length === 0) return null

    return(
      <ul className="c-tab-bar  u-panel">
        {this.props.editors.map((editor) => {
          return (
            <li key={editor.path}
                className={this.tabClasses(editor)}
                onClick={this.handleClick.bind(this, editor.path)}>
              <span>{editor.name}</span>
              <span className="c-tab-bar__close  js-close"/>
            </li>
          )
        })}
      </ul>
    )
  }
}
