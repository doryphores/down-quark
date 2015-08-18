import _ from "underscore"
import fs from "fs"
import path from "path"

const IGNORED_FILES = [".DS_Store", "Thumbs.db", ".git"]

class Node {
  constructor(p) {
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

    // Read node list from file system
    var nodeList = _.difference(fs.readdirSync(this.path), IGNORED_FILES)

    // Update node list and sort
    this.children = _.union(
      _.reject(this.children, (node) => {
        return nodeList.indexOf(node.name) === -1
      }),
      _.difference(nodeList, _.pluck(this.children, "name")).map((p) => {
        return new Node(path.join(this.path, p))
      })
    ).sort(
      function nodeCompare(a, b) {
        if (a.type == b.type) return a.name.localeCompare(b.name)
        return a.type == "dir" ? -1 : 1
      }
    )

    this.expanded = true

    console.log("START WATCHING PATH:" + this.path)
  }

  close() {
    if (this.type === "file") return

    this.expanded = false

    console.log("STOP WATCHING PATH:" + this.path)
  }
}

export default class FileTree extends Node {
  constructor(root) {
    super(root)
    this.open()
  }
}
