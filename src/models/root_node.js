import Node from "./node"

export default class RootNode extends Node {
  constructor(p, {expandedPaths, selectedPath} = {}) {
    super(p)

    this._selectedNode = null

    expandedPaths = expandedPaths || [this.path]

    // Restore expanded nodes (root is expanded by default)
    expandedPaths.sort().forEach((p) => {
      let n = this.findNode(p)
      if (n) n.open()
    })

    if (selectedPath) this.changeSelection(selectedPath)

    this.on("change", () => {
      if (this._selectedNode && !this.findNode(this._selectedNode.path)) {
        this._selectedNode = null
      }
    })
  }

  getSelectedPath() {
    return this._selectedNode ? this._selectedNode.path : null
  }

  changeSelection(nodePath) {
    if (this._selectedNode) this._selectedNode.unselect()
    let node = this.findNode(nodePath)
    if (!node) return null
    node.select()
    this._selectedNode = node
    return nodePath
  }

  expand(nodePath) {
    this.findNode(nodePath).open()
  }

  collapse(nodePath) {
    this.findNode(nodePath).close()
  }
}
