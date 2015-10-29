import React from "react"
import BaseComponent from "./base_component"
import CodeMirror from "../utils/code_mirror_setup"
import classNames from "classnames"
import EditorMenu from "../menus/editor_menu"
import EditorCommands from "../utils/editor_commands"

export default class Editor extends BaseComponent {
  componentDidMount() {
    this.codeMirrorInstance = CodeMirror(React.findDOMNode(this), {
      mode              : "frontmatter_markdown",
      theme             : this.props.prefs.editor_theme,
      lineWrapping      : true,
      showTrailingSpace : true,
      value             : this.props.buffer.content
    })

    this.codeMirrorInstance.on("change", this.handleChange.bind(this))

    this.codeMirrorInstance.on("blur", () => {
      if (this.props.buffer.active) {
        EditorCommands.unbind(this.codeMirrorInstance)
      }
    })

    this.codeMirrorInstance.on("focus", () => {
      if (this.props.buffer.active) {
        EditorCommands.bind(this.codeMirrorInstance)
      }
    })

    if (this.props.buffer.active) {
      this.codeMirrorInstance.focus()
      setTimeout(() => this.codeMirrorInstance.refresh(), 100)
    }
  }

  componentWillUnmount() {
    this.codeMirrorInstance.off("change")
    EditorCommands.unbind(this.codeMirrorInstance)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.buffer != this.props.buffer
      || nextProps.prefs.editor_theme != this.props.prefs.editor_theme
      || nextProps.prefs.editor_font_size != this.props.prefs.editor_font_size
  }

  componentDidUpdate(prevProps, prevState) {
    this.codeMirrorInstance.setOption("theme", this.props.prefs.editor_theme)

    if (prevProps.prefs.editor_font_size != this.props.prefs.editor_font_size) {
      this.codeMirrorInstance.refresh()
    }

    // Update content if it's clean and content has changed on disk
    if (this.props.buffer.clean &&
      this.props.buffer.content !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(this.props.buffer.content)
    }

    if (this.props.buffer.active) {
      this.codeMirrorInstance.focus()

      if (!prevProps.buffer.active) {
        EditorCommands.bind(this.codeMirrorInstance)
        // Refresh editor if it has just gained focus
        this.codeMirrorInstance.refresh()
      }
    }

    if (!this.props.buffer.active && prevProps.buffer.active) {
      EditorCommands.unbind(this.codeMirrorInstance)
    }
  }

  handleChange() {
    this.context.flux.getActions("BufferActions").changeContent({
      id      : this.props.buffer.id,
      content : this.codeMirrorInstance.getValue()
    })
  }

  showMenu() {
    if (!this.menu) this.menu = new EditorMenu()
    this.menu.show()
  }

  render() {
    return <div className="c-editor" onContextMenu={this.showMenu.bind(this)}/>
  }
}
