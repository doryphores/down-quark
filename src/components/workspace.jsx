import React from "react"
import classNames from "classnames"
import _ from "underscore"
import TabBar from "./tab_bar"
import Editor from "./editor"
import LocalStorageManager from "../utils/local_storage_manager"

export default class Workspace extends React.Component {
  static contextTypes = {
    flux : React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.state = { previewStyles: {} }
    let previewWidth = LocalStorageManager.get("previewWidth")
    if (previewWidth) this.state.previewStyles.width = previewWidth
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.previewStyles != nextState.previewStyles) return true
    if (nextProps.bufferStore.activeBufferIndex != this.props.bufferStore.activeBufferIndex) return true
    if (nextProps.bufferStore.buffers.length != this.props.bufferStore.buffers.length) return true
    return _.some(nextProps.bufferStore.buffers, (b, i) => {
      return b !== this.props.bufferStore.buffers[i]
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.bufferStore.activeBufferIndex > -1 &&
      prevProps.bufferStore.activeBufferIndex != this.props.bufferStore.activeBufferIndex
    ) {
      React.findDOMNode(this.refs.previewPane).scrollTop = 0
    }
  }

  startResize() {
    let {left, width} = React.findDOMNode(this).getBoundingClientRect()

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

  render() {
    if (!this.props.bufferStore.buffers.length) return null

    return (
      <div className={this.componentClasses()}>
        <TabBar className="u-panel" buffers={this.props.bufferStore.buffers}/>

        <div className="u-panel u-panel--grow u-container u-container--horizontal">
          <div className="c-workspace__item-list u-panel u-panel--grow">
            {this.props.bufferStore.buffers.map((buffer, index) => {
              return (
                <div key={buffer.id} className={this.itemClasses(buffer)}>
                  <Editor buffer={buffer}/>
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
