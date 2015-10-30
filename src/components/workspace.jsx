import React from "react"
import BaseComponent from "./base_component"
import classNames from "classnames"
import _ from "underscore"
import TabBar from "./tab_bar"
import Editor from "./editor"
import LocalStorageManager from "../utils/local_storage_manager"

export default class Workspace extends BaseComponent {
  constructor(props, context) {
    super(props, context)
    this.state = { previewStyles: {} }
    let previewWidth = LocalStorageManager.get("previewWidth")
    if (previewWidth) this.state.previewStyles.width = previewWidth
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.bufferStore.activeBufferIndex > -1 &&
      prevProps.bufferStore.activeBufferIndex != this.props.bufferStore.activeBufferIndex
    ) {
      this.refs.previewPane.scrollTop = 0
    }
  }

  startResize() {
    let {left, width} = this.refs.workspace.getBoundingClientRect()

    document.body.classList.add("is-resizing")

    var endResize = () => {
      document.body.classList.remove("is-resizing")
      document.removeEventListener("mousemove", resize)
      document.removeEventListener("mouseup", endResize)
      LocalStorageManager.set("previewWidth", this.state.previewStyles.width)
    }

    var resize = (e) => {
      this.setWidth((100 - (e.clientX - left) * 100 / width).toString() + "%")
    }

    document.addEventListener("mouseup", endResize)
    document.addEventListener("mousemove", resize)
  }

  setWidth(width) {
    if (width === undefined) return

    this.setState({
      previewStyles: {
        width: width
      }
    })
  }

  componentClasses() {
    return classNames(this.props.className,
      "c-workspace u-container u-container--vertical")
  }

  itemClasses(buffer) {
    return classNames("c-workspace__item", {
      "c-workspace__item--active": buffer.active
    })
  }

  previewContent() {
    return this.context.flux.getStore("BufferStore").getPreviewContent()
  }

  editorStyles() {
    return {
      fontSize: this.props.prefs.getIn(["editor", "font_size"]) + "px"
    }
  }

  render() {
    if (!this.props.bufferStore.buffers.length) return null

    return (
      <div className={this.componentClasses()} ref="workspace">
        <TabBar className="u-panel" buffers={this.props.bufferStore.buffers}/>

        <div className="u-panel u-panel--grow u-container u-container--horizontal">
          <div className="c-workspace__item-list u-panel u-panel--grow" style={this.editorStyles()}>
            {this.props.bufferStore.buffers.map((buffer, index) => {
              return (
                <div key={buffer.id} className={this.itemClasses(buffer)}>
                  <Editor buffer={buffer} prefs={this.props.prefs.get("editor")}/>
                </div>
              )
            })}
          </div>
          <div className="c-preview-panel u-panel" style={this.state.previewStyles}>
            <div ref="previewPane"
                 className="c-preview-panel__content"
                 dangerouslySetInnerHTML={{__html: this.previewContent()}}/>
            <div className="c-preview-panel__resize-handle"
                 onMouseDown={this.startResize.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}
