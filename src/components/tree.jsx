import React from "react"
import classNames from "classnames"
import TreeActions from "../actions/tree_actions"
import FileSystemActions from "../actions/file_system_actions"
import TreeMenu from "../menus/tree_menu"
import LocalStorageManager from "../utils/local_storage_manager"

export default class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.state = { treeStyles: {} }
    var treeWidth = LocalStorageManager.get("treeWidth")
    if (treeWidth) this.state.treeStyles.width = treeWidth
  }

  componentDidMount() {
    var treeWidth = LocalStorageManager.get("treeWidth")
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

  render() {
    if (this.props.tree.root === null) return null

    return (
      <div className={classNames(this.props.className, "c-tree")} style={this.state.treeStyles}>
        <div className="c-tree__scroller">
          <ul className="c-tree__node-list">
            <TreeNode node={this.props.tree.root}
                      selectedPath={this.props.tree.selectedPath}/>
          </ul>
        </div>
        <div className="c-tree__resize-handle"
             onMouseDown={this.startResize.bind(this)}/>
      </div>
    )
  }
}

class TreeNode extends React.Component {
  handleClick() {
    if (this.props.node.type === "dir") {
      var action = this.props.node.expanded ? "collapse" : "expand"
      TreeActions[action](this.props.node)
    }
    TreeActions.select(this.props.node.path)
  }

  handleDoubleClick() {
    if (this.props.node.type === "dir") return
    FileSystemActions.open(this.props.node.path)
  }

  handleContextMenu() {
    TreeActions.select(this.props.node.path)
    var menu = new TreeMenu(this.props.node)
    menu.show()
  }

  nodeClasses() {
    return classNames("c-tree__node", {
      "c-tree__node--expanded": this.props.node.expanded,
      "c-tree__node--selected": this.props.node.path === this.props.selectedPath
    })
  }

  labelClasses() {
    return classNames("c-tree__node-label", {
      "octicon-file-text": this.props.node.type === "file",
      "octicon-file-directory": this.props.node.type === "dir"
    })
  }

  render() {
    var nodeLabel = (
      <span className={this.labelClasses()}
            onClick={this.handleClick.bind(this)}
            onDoubleClick={this.handleDoubleClick.bind(this)}
            onContextMenu={this.handleContextMenu.bind(this)}>
        {this.props.node.name}
      </span>
    )

    if (this.props.node.type === "file") {
      return <li className={this.nodeClasses()}>{nodeLabel}</li>
    } else {
      return (
        <li className={this.nodeClasses()}>
          {nodeLabel}
          <ul className="c-tree__node-list">
            {this.props.node.children.map((node) => {
              return (
                <TreeNode key={node.name}
                          node={node}
                          selectedPath={this.props.selectedPath}/>
              )
            })}
          </ul>
        </li>
      )
    }
  }
}
