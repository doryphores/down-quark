import React from "react"
import classNames from "classnames"
import TreeActions from "../actions/tree_actions"

export default class Tree extends React.Component {
  startResize() {
    document.body.classList.add("is-resizing")
    var endResize = () => {
      document.body.classList.remove("is-resizing")
      document.removeEventListener("mousemove", resize)
      document.removeEventListener("mouseup", endResize)
    }
    var resize = (evt) => {
      React.findDOMNode(this).style.width = evt.clientX + "px"
    }
    document.addEventListener("mouseup", endResize)
    document.addEventListener("mousemove", resize)
  }

  render() {
    if (this.props.root === null) return null

    return (
      <div className="u-panel  c-tree">
        <div className="c-tree__scroller">
          <ul className="c-tree__node-list">
            <TreeNode node={this.props.root}/>
          </ul>
        </div>
        <div className="c-tree__resizer"
             onMouseDown={this.startResize.bind(this)}/>
      </div>
    )
  }
}

class TreeNode extends React.Component {
  handleClick() {
    var action = this.props.node.expanded ? "collapse" : "expand"
    TreeActions[action](this.props.node)
  }

  nodeClasses() {
    return classNames("c-tree__node", {
      "octicon-file-text": this.props.node.type === "file",
      "octicon-file-directory": this.props.node.type === "dir",
      "c-tree__node--expanded": this.props.node.expanded
    })
  }

  render() {
    var nodeLabel = (
      <span className="c-tree__node-label"
            onClick={this.handleClick.bind(this)}>{this.props.node.name}</span>
    )

    if (this.props.node.type === "file") {
      return <li className={this.nodeClasses()}>{nodeLabel}</li>
    } else {
      return (
        <li className={this.nodeClasses()}>
          {nodeLabel}
          <ul className="c-tree__node-list">
            {this.props.node.children.map((node) => {
              return <TreeNode key={node.name} node={node}/>
            })}
          </ul>
        </li>
      )
    }
  }
}
