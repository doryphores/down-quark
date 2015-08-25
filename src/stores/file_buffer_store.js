import alt from "../alt"
import fs from "fs"
import path from "path"
import _ from "underscore"
import FileSystemActions from "../actions/file_system_actions"
import EditorActions from "../actions/editor_actions"
import TabActions from "../actions/tab_actions"
import TreeActions from "../actions/tree_actions"
import PathWatcher from "pathwatcher"

var _watchers = {}

class FileBufferStore {
  static config = {
    onSerialize: (data) => {
      return data.buffers
    },

    onDeserialize: (data) => {
      return {
        buffers: data,
        count: data.length,
        activeBuffer: _.find(data, (buffer) => {
          return buffer.active
        })
      }
    }
  }

  constructor() {
    this.buffers = []
    this.count = 0
    this.activeBuffer = null

    this.bindListeners({
      openBuffer       : FileSystemActions.OPEN_FILE,
      closeBuffer      : FileSystemActions.CLOSE_FILE,
      setActiveBuffer  : TabActions.SELECT_TAB,
      updateBuffer     : EditorActions.CHANGE_CONTENT,
      saveActiveBuffer : EditorActions.SAVE_FILE
    })
  }

  openBuffer(filePath) {
    var existingBuffer = this.findBuffer(filePath)

    if (existingBuffer) {
      // The file is already open so set it as active
      this.setActiveBuffer(filePath)
    } else {
      fs.readFile(filePath, {
        encoding: "utf-8"
      }, (err, content) => {
        if (err) console.log(err)
        else {
          this.count = this.buffers.push({
            path        : filePath,
            name        : path.basename(filePath),
            content     : content,
            diskContent : content,
            clean       : true,
            active      : false
          })

          this.watch(_.last(this.buffers))
          this.setActiveBuffer(filePath)
          this.emitChange()
        }
      })
      // We are reading the file content asynchronously so do not
      // emit a change event
      return false
    }
  }

  closeBuffer(filePath) {
    if (this.count === 0) return

    // Close active buffer by default
    if (filePath === undefined) filePath = this.activeBuffer.path

    var index = _.findIndex(this.buffers, (buffer) => {
      return buffer.path === filePath
    })

    if (index === -1) return

    if (filePath === this.activeBuffer.path) {
      if (this.count === 1) {
        this.activeBuffer = null
      } else {
        // Set closest buffer as active
        this.setActiveBuffer(this.buffers[index ? index - 1 : 1].path)
      }
    }

    this.unwatch(this.buffers.splice(index, 1))
    this.count = this.count - 1
  }

  updateBuffer(data) {
    var buffer = this.findBuffer(data.filePath)
    buffer.content = data.content
    buffer.clean = buffer.content === buffer.diskContent
  }

  saveActiveBuffer() {
    console.log("SAVE FILE");
    this.unwatch(this.activeBuffer)
    fs.writeFile(this.activeBuffer.path, this.activeBuffer.content, {
      encoding: "utf-8"
    }, (err) => {
      if (err) return console.log(err)
      this.activeBuffer.diskContent = this.activeBuffer.content
      this.activeBuffer.clean = true
      this.watch(this.activeBuffer)
      this.emitChange()
    })
    return false
  }

  setActiveBuffer(filePath) {
    if (this.activeBuffer) {
      this.activeBuffer.active = false
    }

    this.activeBuffer = this.findBuffer(filePath)

    if (this.activeBuffer) {
      this.activeBuffer.active = true
    }

    // Select active tree node
    TreeActions.select.defer(filePath)
  }

  findBuffer(filePath) {
    return _.find(this.buffers, (buffer) => {
      return buffer.path === filePath
    })
  }

  watch(buffer) {
    // Close and delete any existing watchers for this file
    this.unwatch(buffer)

    _watchers[buffer.path] = PathWatcher.watch(buffer.path, () => {
      fs.readFile(buffer.path, (err, content) => {
        if (err) {
          // File is gone so close it
          this.closeBuffer(buffer.path)
        } else {
          // File has changed so update it
          if (buffer.clean) buffer.content = content
          buffer.diskContent = content
          buffer.clean = buffer.content === buffer.diskContent
        }
        this.emitChange()
      })
    })
  }

  unwatch(buffer) {
    if (_watchers[buffer.path]) {
      _watchers[buffer.path].close()
      delete _watchers[buffer.path]
    }
  }
}

export default alt.createStore(FileBufferStore, "FileBufferStore")
