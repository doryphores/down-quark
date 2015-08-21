import _ from "underscore"
import fs from "fs"
import path from "path"
import PathWatcher from "pathwatcher"
import EventEmitter from "events"

const IGNORED_FILES = [".DS_Store", "Thumbs.db", ".git"]

class Node extends EventEmitter {
  constructor(p) {
    super()
    this.path = p
    this.name = path.basename(p)
    this.expanded = false

    if (fs.statSync(p).isDirectory()) {
      this.type = "dir"
      this.children = []
    } else {
      this.type = "file"
    }
  }

  open() {
    if (this.type === "file") return

    this.reload()

    this.expanded = true

    this.watch()
  }

  close() {
    if (this.type === "file") return

    this.expanded = false

    this.unwatch()
  }

  reload() {
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
        node.on("change", this.emit.bind(this, "change"))
        return node
      })
    ).sort(
      function nodeCompare(a, b) {
        if (a.type == b.type) return a.name.localeCompare(b.name)
        return a.type == "dir" ? -1 : 1
      }
    )

    this.children.forEach((node) => {if (node.expanded) node.reload()})

    this.emit("change")
  }

  watch() {
    this.watcher = PathWatcher.watch(this.path, (event) => {
      if (event == "change") this.reload()
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
}

export default class FileTree extends Node {
  constructor(root) {
    super(root)
    this.open()
  }

  clean() {
    this.unwatch()
  }
}
