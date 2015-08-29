import React from "react"
import CodeMirror from "../utils/code_mirror_setup"
import classNames from "classnames"
import EditorActions from "../actions/editor_actions"

export default class Editor extends React.Component {
  componentDidMount() {
    this.codeMirrorInstance = CodeMirror(React.findDOMNode(this), {
      mode              : "frontmatter_markdown",
      theme             : "material",
      lineWrapping      : true,
      showTrailingSpace : true,
      value             : this.props.buffer.get("content")
    })

    this.codeMirrorInstance.on("change", this.handleChange.bind(this))

    if (this.props.buffer.get("active")) {
      this.codeMirrorInstance.focus()
      setTimeout(() => this.codeMirrorInstance.refresh(), 100)
    }
  }

  componentWillUnmount() {
    this.codeMirrorInstance.off("change")
  }

  componentDidUpdate(prevProps, prevState) {
    // Update content if it's clean and content has changed on disk
    if (this.props.buffer.get("clean") &&
        this.props.buffer.get("content") !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(this.props.buffer.get("content"))
    }

    if (this.props.buffer.get("active")) {
      this.codeMirrorInstance.focus()

      // Refresh editor if it has just gained focus
      if (!prevProps.buffer.get("active")) {
        this.codeMirrorInstance.refresh()
      }
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
