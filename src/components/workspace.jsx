import React from "react"
import classNames from "classnames"
import _ from "underscore"
import MarkdownConverter from "../utils/markdown_converter"
import TabBar from "./tab_bar"
import Editor from "./editor"

export default class Workspace extends React.Component {
  startResize() {
    document.body.classList.add("is-resizing")
    var endResize = () => {
      document.body.classList.remove("is-resizing")
      document.removeEventListener("mousemove", resize)
      document.removeEventListener("mouseup", endResize)
    }
    var resize = (evt) => {
      var container = React.findDOMNode(this)
      var previewPane = React.findDOMNode(this.refs.previewPane)
      var panelWidth = container.getBoundingClientRect().width - (evt.clientX - container.getBoundingClientRect().left)
      previewPane.style.width = panelWidth + "px"
    }
    document.addEventListener("mouseup", endResize)
    document.addEventListener("mousemove", resize)
  }

  previewContent() {
    return MarkdownConverter.makeHtml(_.find(this.props.editors, (editor => {
      return editor.active
    })).content)
  }

  componentClasses() {
    return classNames(this.props.className,
      "c-workspace u-container u-container--vertical")
  }

  itemClasses(editor) {
    return classNames("c-workspace__item", {
      "c-workspace__item--active": editor.active
    })
  }

  render() {
    if (this.props.editors.length === 0) return null

    return (
      <div className={this.componentClasses()}>
        <TabBar className="u-panel" editors={this.props.editors}/>

        <div className="u-panel u-panel--grow u-container u-container--horizontal">
          <div className="c-workspace__item-list u-panel u-panel--grow">
            {this.props.editors.map((editor) => {
              return (
                <div key={editor.path} className={this.itemClasses(editor)}>
                  <Editor editor={editor}/>
                </div>
              )
            })}
          </div>
          <div className="c-preview-panel u-panel" ref="previewPane">
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
