import _ from "underscore"
import fs from "fs"
import path from "path"
import PathWatcher from "pathwatcher"
import EventEmitter from "events"

const IGNORED_FILES = [".DS_Store", "Thumbs.db", ".git"]

export default class Node extends EventEmitter {
  constructor(p, parent = null) {
    super()
    this.path = p
    this.name = path.basename(p)
    this.expanded = false
    this.selected = false
    this.version = Date.now()

    if (fs.statSync(p).isDirectory()) {
      this.type = "dir"
      this.children = []
    } else {
      this.type = "file"
    }

    if (parent) {
      // Ensure "change" events bubble up the tree
      this.on("change", () => parent.emitChange())
    }
  }

  memo() {
    if (this._memo && this._memo.version === this.version) return this._memo

    this._memo = {
      path     : this.path,
      name     : this.name,
      expanded : this.expanded,
      selected : this.selected,
      version  : this.version,
      type     : this.type
    }

    if (this.type == "dir") {
      this._memo.children = this.children.map(n => n.memo())
    }

    return this._memo
  }

  emitChange() {
    this.version++
    this.emit("change")
  }

  open() {
    if (this.type === "file") return
    this.expanded = true
    this.reload()
    this.watch()
  }

  close() {
    if (this.type === "file") return
    this.expanded = false
    this.emitChange()
    this.unwatch()
  }

  select() {
    this.selected = true
    this.emitChange()
  }

  unselect() {
    this.selected = false
    this.emitChange()
  }

  reload(recursive = true) {
    // TODO: delete node if read dir fails

    // Read node list from file system
    let nodeList = _.difference(fs.readdirSync(this.path), IGNORED_FILES)

    // Update node list and sort
    this.children = _.union(
      _.reject(this.children, (node) => {
        if (nodeList.indexOf(node.name) == -1) {
          // This node no longer exists so unwatch it
          node.unwatch()
          return true
        }
        return false
      }),
      _.difference(nodeList, _.pluck(this.children, "name")).map((p) => {
        return new Node(path.join(this.path, p), this)
      })
    ).sort((a, b) => {
      if (a.type == b.type) return a.name.localeCompare(b.name)
      return a.type == "dir" ? -1 : 1
    })

    if (recursive) {
      this.children.forEach((node) => {
        if (node.expanded) node.reload()
      })
    }

    this.emitChange()
  }

  watch() {
    if (this.type == "file") return

    this.watcher = PathWatcher.watch(this.path, (event) => {
      if (event == "change") this.reload(false)
    })

    this.children.forEach(node => node.expanded && node.watch())
  }

  unwatch() {
    if (this.type == "file") return

    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }

    this.children.forEach(node => {
      if (node.type == "dir") node.unwatch()
    })
  }

  findNode(nodePath) {
    let relativePath = path.relative(this.path, nodePath)

    if (relativePath === "") return this

    let nextNodeName = relativePath.split("/")[0]
    let nextNode = _.find(this.children, (n) => {
      return n.name === nextNodeName
    })

    return nextNode && nextNode.findNode(nodePath)
  }

  getExpandedPaths() {
    if (this.type == "file") return []
    return _.union(
      this.expanded ? [this.path] : [],
      _.flatten(this.children.filter(n => n.expanded).
        map(n => n.getExpandedPaths()))
    )
  }
}
