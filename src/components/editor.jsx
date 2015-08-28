import React from "react"
import CodeMirror from "../utils/code_mirror_setup"
import classNames from "classnames"
import EditorActions from "../actions/editor_actions"
import _ from "underscore"

export default class Editor extends React.Component {
  componentDidMount() {
    this.codeMirrorInstance = CodeMirror(React.findDOMNode(this), {
      mode              : "frontmatter_markdown",
      theme             : "seti",
      lineWrapping      : true,
      showTrailingSpace : true,
      value             : this.props.buffer.get("content")
    })

    this.codeMirrorInstance.on("change", this.handleChange.bind(this))

    if (this.props.buffer.get("active")) {
      this.codeMirrorInstance.focus()
      _.defer(() => this.codeMirrorInstance.refresh())
    }
  }

  componentWillUnmount() {
    this.codeMirrorInstance.off("change")
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.buffer.get("active") && this.props.buffer.get("active")) {
      this.codeMirrorInstance.focus()
      this.codeMirrorInstance.refresh()
    }

    // Update editor if the clean content has changed on disk
    if (this.props.buffer.get("clean") &&
        this.props.buffer.get("content") !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(this.props.buffer.get("content"))
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
