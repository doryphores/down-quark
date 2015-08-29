import React from "react"
import classNames from "classnames"
import _ from "underscore"
import MarkdownConverter from "../utils/markdown_converter"
import TabBar from "./tab_bar"
import Editor from "./editor"
import FileBufferStore from "../stores/file_buffer_store"
import LocalStorageManager from "../utils/local_storage_manager"

export default class Workspace extends React.Component {
  constructor(props) {
    super(props)
    this.state = { previewStyles: {} }
    var previewWidth = LocalStorageManager.get("previewWidth")
    if (previewWidth) this.state.previewStyles.width = previewWidth
  }

  startResize() {
    var {left, width} = React.findDOMNode(this).getBoundingClientRect()

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

  previewContent() {
    var activeBuffer = FileBufferStore.getActiveBuffer()
    if (activeBuffer === undefined) return ""
    return MarkdownConverter.makeHtml(activeBuffer.content)
  }

  componentClasses() {
    return classNames(this.props.className,
      "c-workspace u-container u-container--vertical")
  }

  itemClasses(buffer) {
    return classNames("c-workspace__item", {
      "c-workspace__item--active": buffer.get("active")
    })
  }

  render() {
    if (this.props.buffers.size === 0) return null

    return (
      <div className={this.componentClasses()}>
        <TabBar className="u-panel" buffers={this.props.buffers}/>

        <div className="u-panel u-panel--grow u-container u-container--horizontal">
          <div className="c-workspace__item-list u-panel u-panel--grow">
            {this.props.buffers.map((buffer, index) => {
              return (
                <div key={buffer.get("uid")} className={this.itemClasses(buffer)}>
                  <Editor buffer={buffer} bufferIndex={index}/>
                </div>
              )
            })}
          </div>
          <div className="c-preview-panel u-panel" style={this.state.previewStyles}>
            <div className="c-preview-panel__content"
                 dangerouslySetInnerHTML={{__html: this.previewContent()}}/>
            <div className="c-preview-panel__resize-handle"
                 onMouseDown={this.startResize.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}
