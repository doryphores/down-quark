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
      value             : this.props.editor.content
    })

    // We need to override the copy/paste operation keyboard
    // shortcuts to work with the context menu
    // if (process.platform === 'darwin') {
    //   this.editor.setOption("extraKeys", {
    //     "Cmd-C": this._onCopy,
    //     "Cmd-V": this._onPaste,
    //     "Cmd-X": this._onCut,
    //     "Cmd-S": this._onSave
    //   });
    // } else {
    //   this.editor.setOption("extraKeys", {
    //     "Ctrl-C": this._onCopy,
    //     "Ctrl-V": this._onPaste,
    //     "Ctrl-X": this._onCut,
    //     "Ctrl-S": this._onSave
    //   });
    // }

    this.codeMirrorInstance.on("change", this.handleChange.bind(this))

    this.codeMirrorInstance.focus()
  }

  componentWillUnmount() {
    this.codeMirrorInstance.off("change")
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.editor.active && this.props.editor.active) {
      this.codeMirrorInstance.focus()
    }

    // Update editor if the clean content has changed on disk
    if (this.props.editor.clean &&
        this.props.editor.content !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(this.props.editor.content)
    }
  }

  handleChange() {
    EditorActions.changeContent({
      filePath : this.props.editor.path,
      content  : this.codeMirrorInstance.getValue()
    })
  }

  render() {
    return <div className="c-editor"/>
  }
}
