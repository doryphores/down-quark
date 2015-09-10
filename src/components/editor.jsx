import React from "react"
import CodeMirror from "../utils/code_mirror_setup"
import classNames from "classnames"

export default class Editor extends React.Component {
  static contextTypes = {
    flux : React.PropTypes.object
  }

  componentDidMount() {
    this.codeMirrorInstance = CodeMirror(React.findDOMNode(this), {
      mode              : "frontmatter_markdown",
      theme             : "material",
      lineWrapping      : true,
      showTrailingSpace : true,
      value             : this.props.buffer.content
    })

    this.codeMirrorInstance.on("change", this.handleChange.bind(this))

    if (this.props.buffer.active) {
      this.codeMirrorInstance.focus()
      setTimeout(() => this.codeMirrorInstance.refresh(), 100)
    }
  }

  componentWillUnmount() {
    this.codeMirrorInstance.off("change")
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.buffer !== this.props.buffer
  }

  componentDidUpdate(prevProps, prevState) {
    // Update content if it's clean and content has changed on disk
    if (this.props.buffer.clean &&
      this.props.buffer.content !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(this.props.buffer.content)
    }

    if (this.props.buffer.active) {
      this.codeMirrorInstance.focus()

      // Refresh editor if it has just gained focus
      if (!prevProps.buffer.active) {
        this.codeMirrorInstance.refresh()
      }
    }
  }

  handleChange() {
    this.context.flux.getActions("EditorActions").changeContent({
      id      : this.props.buffer.id,
      content : this.codeMirrorInstance.getValue()
    })
  }

  render() {
    return <div className="c-editor"/>
  }
}
