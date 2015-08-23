import React from "react"
import CodeMirror from "../utils/code_mirror_setup"
import classNames from "classnames"
import EditorActions from "../actions/editor_actions"

export default class Editor extends React.Component {
  componentDidMount() {
    this.codeMirror = CodeMirror(React.findDOMNode(this.refs.editor), {
      mode              : "frontmatter_markdown",
      theme             : "zenburn",
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

    this.codeMirror.on("change", this.handleChange.bind(this))

    this.codeMirror.focus()
  }

  componentWillUnmount() {
    this.codeMirror.off("change")
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.editor.active && this.props.editor.active) {
      this.codeMirror.focus()
    }

    // Update editor if the clean content has changed on disk
    if (this.props.editor.clean && this.props.editor.content !== this.codeMirror.getValue()) {
      this.codeMirror.setValue(this.props.editor.content)
    }
  }

  handleChange() {
    EditorActions.changeContent({
      filePath : this.props.editor.path,
      content  : this.codeMirror.getValue()
    })
  }

  panelClasses() {
    return classNames("c-editor  u-container  u-container--horizontal", {
      "c-editor--active": this.props.editor.active
    })
  }

  render() {
    return (
      <div className={this.panelClasses()}>
        <div className="c-editor__container  u-panel" ref="editor"/>
        <div className="c-editor__preview  u-panel"/>
      </div>
    )
  }
}
