import React from "react"
import classNames from "classnames"
import EditorActions from "../actions/editor_actions"

export default class EditorPanes extends React.Component {
  editorClasses(editor) {
    return classNames("c-editor", "u-panel u-panel--grow", {
      "c-editor--active": editor.active
    })
  }

  handleChange(editor, event) {
    EditorActions.changeContent(editor.path, event.target.value)
  }

  render() {
    return (
      <div className="u-panel  u-panel--grow  u-container  u-container--horizontal  c-editors">
        {this.props.editors.map((editor) => {
          return (
            <textarea key={editor.path}
                      className={this.editorClasses(editor)}
                      defaultValue={editor.content}
                      onChange={this.handleChange.bind(this, editor)}/>
          )
        })}
      </div>
    )
  }
}
