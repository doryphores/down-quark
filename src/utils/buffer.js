import fs from "fs-extra"
import path from "path"
import _ from "underscore"
import PathWatcher from "pathwatcher"
import EventEmitter from "events"

class Buffer extends EventEmitter {
  constructor(p) {
    this.name = "untitled"
    this.path = ""
    this.content = ""
    this.diskContent = ""
    this.active = false
    this.clean = true
    this.version = Date.now()
    this.watcher = null

    if (p) {
      this.path = p
      this.name = path.basename(this.path)
      this.read()
      this.watch()
    }
  }

  read() {
    let previousDiskContent = this.diskContent

    try {
      this.diskContent = fs.readFileSync(this.path, "utf-8")
      if (this.clean) this.content = this.diskContent
    } catch(e) {
      // File does not exist
      this.diskContent = ""
    }
    this.clean = this.content == this.diskContent

    if (this.diskContent != previousDiskContent) {
      this.version++
    }
  }

  save(p) {
    if (p === undefined) this.path = p
    this.name = path.basename(p)
    this.unwatch()
    fs.outputFileSync(this.path, this.content)
    this.watch()
    this.version++
  }

  updateContent(content) {
    this.content = content
    this.clean = this.content == this.diskContent
    this.version++
  }

  activate() {
    this.active = true
    this.version++
  }

  deactivate() {
    this.active = false
    this.version++
  }

  watch() {
    this.watcher = PathWatcher.watch(this.path, (event) => {
      this.read()
      this.emit("change")
    })
  }

  unwatch() {
    this.watcher.close()
    this.watcher = null
  }

  memo() {
    if (this._memo.version != this.version) {
      this._memo = {
        name: this.name,
        path: this.path,
        content: this.content,
        diskContent: this.diskContent,
        active: this.active,
        clean: this.clean,
        version: this.version
      }
    }

    return this._memo
  }
}
