import React from "react"
import classNames from "classnames"
import TreeStore from "../stores/tree_store"
import TreeActions from "../actions/tree_actions"

export default class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.state = TreeStore.getState()
  }

  componentDidMount() {
    TreeStore.listen(this.onChange.bind(this))
  }

  componentWillUnmount() {
    TreeStore.unlisten()
  }

  onChange(state) {
    this.setState(state)
  }

  render() {
    if (this.state.tree === null) return null

    return (
      <div className="u-panel  c-tree">
        <ul className="c-tree__node-list">
          <TreeNode node={this.state.tree}/>
        </ul>
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
      "c-tree__node--file": this.props.node.type === "file",
      "c-tree__node--folder": this.props.node.type === "folder",
      "c-tree__node--expanded": this.props.node.expanded
    })
  }

  render() {
    if (this.props.node.type === "file") {
      return <li className={this.nodeClasses()}>{this.props.node.name}</li>
    } else {
      return (
        <li className={this.nodeClasses()}>
          <span onClick={this.handleClick.bind(this)}>{this.props.node.name}</span>
          <ul className="c-tree__node-list">
            {this.props.node.children.map((node) => {
              return <TreeNode key={node.path} node={node}/>
            })}
          </ul>
        </li>
      )
    }
  }
}
