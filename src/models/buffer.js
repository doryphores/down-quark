import fs from "fs-extra"
import path from "path"
import _ from "underscore"
import PathWatcher from "pathwatcher"
import EventEmitter from "events"

export default class Buffer extends EventEmitter {
  static BUFFER_COUNTER = 0

  constructor({name = "untitled", filePath = "", content = "", diskContent = "", active = false, clean = true} = {}) {
    super()
    this.name = name
    this.filePath = filePath
    this.content = content
    this.diskContent = diskContent
    this.active = active
    this.clean = clean
    this.version = Date.now()
    this.id = ++Buffer.BUFFER_COUNTER
    this.watcher = null

    if (this.filePath) {
      this.name = path.basename(this.filePath)
      if (this.read()) this.watch()
    }
  }

  read() {
    if (fs.existsSync(this.filePath)) {
      this.diskContent = fs.readFileSync(this.filePath, "utf-8")
      if (this.clean) this.content = this.diskContent
    } else {
      this.diskContent = ""
      if (this.clean) {
        this.clean = false
        this.version++
        return false
      }
    }

    this.clean = this.content == this.diskContent
    this.version++
    return true
  }

  save(p) {
    if (p) this.filePath = p
    this.name = path.basename(this.filePath)
    this.unwatch()
    fs.outputFileSync(this.filePath, this.content)
    this.diskContent = this.content
    this.clean = true
    this.version++
    this.watch()
  }

  updateContent(content) {
    this.content = content
    this.clean = this.content == this.diskContent
    this.version++
  }

  empty() {
    return this.content || this.filePath
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
    this.watcher = PathWatcher.watch(this.filePath, (event) => {
      if (event == "delete") this.emit("delete")
      else {
        if (this.read()) {
          this.emit("change")
        } else {
          this.emit("delete")
        }
      }
    })
  }

  unwatch() {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
  }

  cleanup() {
    this.unwatch()
    this.removeAllListeners()
  }

  memo() {
    if (!this._memo || this._memo.version != this.version) {
      this._memo = {
        id: this.id,
        name: this.name,
        filePath: this.filePath,
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
