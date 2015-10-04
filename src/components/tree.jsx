import React from "react"
import BaseComponent from "./base_component"
import classNames from "classnames"
import TreeMenu from "../menus/tree_menu"
import LocalStorageManager from "../utils/local_storage_manager"

export default class Tree extends BaseComponent {
  constructor(props, context) {
    super(props, context)
    this.state = { treeStyles: {} }
    let treeWidth = LocalStorageManager.get("treeWidth")
    if (treeWidth) this.state.treeStyles.width = treeWidth
  }

  startResize() {
    document.body.classList.add("is-resizing")

    var endResize = () => {
      document.body.classList.remove("is-resizing")
      document.removeEventListener("mousemove", resize)
      document.removeEventListener("mouseup", endResize)
      LocalStorageManager.set("treeWidth", this.state.treeStyles.width)
    }

    var resize = (evt) => this.setWidth(evt.clientX)

    document.addEventListener("mouseup", endResize)
    document.addEventListener("mousemove", resize)
  }

  setWidth(width) {
    if (width === undefined) return

    this.setState({
      treeStyles: {
        width: width
      }
    })
  }

  renderNodeList(rootNode) {
    return (
      <ul className="c-tree__node-list">
        <TreeNode node={rootNode}/>
      </ul>
    )
  }

  render() {
    if (this.props.treeStore.root == null) return null

    return (
      <div className={classNames(this.props.className, "c-tree")} style={this.state.treeStyles}>
        <div className="c-tree__scroller">
          {this.renderNodeList(this.props.treeStore.root)}
        </div>
        <div className="c-tree__resize-handle"
             onMouseDown={this.startResize.bind(this)}/>
      </div>
    )
  }
}

class TreeNode extends BaseComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.node !== this.props.node
  }

  handleClick() {
    if (this.props.node.type == "dir") {
      let action = this.props.node.expanded ? "collapse" : "expand"
      this.context.flux.getActions("TreeActions")[action](this.props.node.path)
    }
    this.context.flux.getActions("TreeActions").select(this.props.node.path)
  }

  handleDoubleClick() {
    if (this.props.node.type == "dir") return
    this.context.flux.getActions("BufferActions").open(this.props.node.path)
  }

  handleContextMenu() {
    this.context.flux.getActions("TreeActions").select(this.props.node.path)
    let menu = new TreeMenu(this.context.flux, this.props.node)
    menu.show()
  }

  nodeClasses() {
    return classNames("c-tree__node", {
      "c-tree__node--expanded": this.props.node.expanded,
      "c-tree__node--selected": this.props.node.selected
    })
  }

  labelClasses() {
    return classNames("c-tree__node-label", {
      "octicon-file-text": this.props.node.type === "file",
      "octicon-file-directory": this.props.node.type === "dir"
    })
  }

  renderChildren() {
    if (this.props.node.type == "dir" && this.props.node.children.length) {
      return (
        <ul className="c-tree__node-list">
          {this.props.node.children.map((node) => {
            return <TreeNode key={node.name} node={node}/>
          })}
        </ul>
      )
    }
  }

  render() {
    return (
      <li className={this.nodeClasses()}>
        <span className={this.labelClasses()}
              onClick={this.handleClick.bind(this)}
              onDoubleClick={this.handleDoubleClick.bind(this)}
              onContextMenu={this.handleContextMenu.bind(this)}>
          {this.props.node.name}
        </span>
        {this.renderChildren()}
      </li>
    )
  }
}
