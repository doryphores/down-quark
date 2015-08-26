import React from "react"
import CodeMirror from "../utils/code_mirror_setup"
import classNames from "classnames"
import EditorActions from "../actions/editor_actions"

export default class Editor extends React.Component {
  componentDidMount() {
    this.codeMirrorInstance = CodeMirror(React.findDOMNode(this), {
      mode              : "frontmatter_markdown",
      theme             : "seti",
      lineWrapping      : true,
      showTrailingSpace : true,
      value             : this.props.buffer.content
    })

    this.codeMirrorInstance.on("change", this.handleChange.bind(this))

    this.codeMirrorInstance.focus()
  }

  componentWillUnmount() {
    this.codeMirrorInstance.off("change")
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.buffer.active && this.props.buffer.active) {
      this.codeMirrorInstance.focus()
    }

    // Update editor if the clean content has changed on disk
    if (this.props.buffer.clean &&
        this.props.buffer.content !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(this.props.buffer.content)
    }
  }

  handleChange() {
    EditorActions.changeContent({
      index   : this.props.bufferIndex,
      content : this.codeMirrorInstance.getValue()
    })
  }

  render() {
    return <div className="c-editor"/>
  }
}
