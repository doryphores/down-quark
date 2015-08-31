import _ from "underscore"
import fs from "fs"
import path from "path"
import PathWatcher from "pathwatcher"
import EventEmitter from "events"

const IGNORED_FILES = [".DS_Store", "Thumbs.db", ".git"]

export default class Node extends EventEmitter {
  constructor(p) {
    super()
    this.path = p
    this.name = path.basename(p)
    this.expanded = false
    this.selected = false
    this.version = 0

    if (fs.statSync(p).isDirectory()) {
      this.type = "dir"
      this.children = []
    } else {
      this.type = "file"
    }
  }

  memo() {
    let memo = {
      path     : this.path,
      name     : this.name,
      expanded : this.expanded,
      selected : this.selected,
      version  : this.version,
      type     : this.type
    }

    if (this.type == "dir") {
      memo.children = this.children.map(n => n.memo())
    }

    return memo
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

  changeSelection(from, to) {
    if (from) this.findNode(from).unselect()
    this.findNode(to).select()
  }

  reload(recursive = true) {
    // Read node list from file system
    var nodeList = _.difference(fs.readdirSync(this.path), IGNORED_FILES)

    // Update node list and sort
    this.children = _.union(
      _.reject(this.children, (node) => {
        return nodeList.indexOf(node.name) === -1
      }),
      _.difference(nodeList, _.pluck(this.children, "name")).map((p) => {
        var node = new Node(path.join(this.path, p))
        // Ensure "change" events bubble up the tree
        node.on("change", this.emitChange.bind(this))
        return node
      })
    ).sort(
      function nodeCompare(a, b) {
        if (a.type == b.type) return a.name.localeCompare(b.name)
        return a.type == "dir" ? -1 : 1
      }
    )

    if (recursive) {
      this.children.forEach((node) => { if (node.expanded) node.reload() })
    }

    this.emitChange()
  }

  watch() {
    this.watcher = PathWatcher.watch(this.path, (event) => {
      if (event == "change") this.reload(false)
    })

    this.children.forEach((node) => {
      if (node.expanded) node.watch()
    })
  }

  unwatch() {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }

    this.children.forEach((node) => {
      if (node.watcher) node.unwatch()
    })
  }

  findNode(nodePath) {
    var relativePath = path.relative(this.path, nodePath)

    if (relativePath === "") return this

    var nextNodeName = relativePath.split("/")[0]
    var nextNode = _.find(this.children, (n) => {
      return n.name === nextNodeName
    })

    return nextNode && nextNode.findNode(nodePath)
  }
}
