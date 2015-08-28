import alt from "../alt"
import fs from "fs"
import path from "path"
import _ from "underscore"
import Immutable from "immutable"
import FileSystemActions from "../actions/file_system_actions"
import EditorActions from "../actions/editor_actions"
import TabActions from "../actions/tab_actions"
import TreeActions from "../actions/tree_actions"
import PathWatcher from "pathwatcher"

var _watchers = {}

class FileBufferStore {
  static config = {
    onSerialize: (data) => {
      // Ignore empty untitled buffers
      return _.select(data.buffers, (buffer) => {
        return buffer.content.length || buffer.path
      })
    },

    onDeserialize: (data) => {
      return {
        buffers: data
      }
    },

    getState: (currentState) => {
      return Immutable.fromJS(currentState)
    }
  }

  constructor() {
    this.state = {
      buffers      : []
    }

    this.activeBufferIndex = -1

    this.bindListeners({
      openBuffer      : FileSystemActions.OPEN_FILE,
      closeBuffer     : FileSystemActions.CLOSE_FILE,
      saveBuffer      : FileSystemActions.SAVE,
      createBuffer    : FileSystemActions.NEW_FILE,
      setActiveBuffer : TabActions.SELECT_TAB,
      updateBuffer    : EditorActions.CHANGE_CONTENT,
      closeAll        : [
        FileSystemActions.OPEN_FOLDER,
        FileSystemActions.CLOSE_ALL
      ]
    })

    this.on("bootstrap", this.reloadBuffers.bind(this))

    this.exportPublicMethods({
      getActiveBuffer: this.getActiveBuffer.bind(this)
    })
  }

  getActiveBuffer() {
    if (this.activeBufferIndex == -1) return undefined
    return this.state.buffers[this.activeBufferIndex]
  }

  getUID() {
    return "buffer-" + Date.now().toString()
  }

  createBuffer() {
    this.state.buffers.push({
      path        : "",
      name        : "untitled",
      content     : "",
      diskContent : "",
      clean       : true,
      active      : false,
      uid         : this.getUID()
    })

    this.setActiveBuffer()
  }

  openBuffer(filePath) {
    var bufferIndex = _.findIndex(this.state.buffers, (buffer) => {
      return buffer.path === filePath
    })

    if (bufferIndex > -1) {
      // The file is already open so set it as active
      this.setActiveBuffer(bufferIndex)
    } else {
      fs.readFile(filePath, {
        encoding: "utf-8"
      }, (err, content) => {
        // TODO: report error?
        if (err) return console.log(err)

        this.state.buffers.push({
          path        : filePath,
          name        : path.basename(filePath),
          content     : content,
          diskContent : content,
          clean       : true,
          active      : false,
          uid         : this.getUID()
        })

        this.watch(_.last(this.state.buffers))
        this.setActiveBuffer()
        this.emitChange()
      })
      // We are reading the file content asynchronously so do not
      // emit a change event
      return false
    }
  }

  reloadBuffers() {
    this.state.buffers.forEach((buffer, index) => {
      if (buffer.active) this.activeBufferIndex = index

      // Only reload buffers linked to a file on disk
      if (!buffer.path) return

      this.unwatch(buffer)

      fs.readFile(buffer.path, {
        encoding: "utf-8"
      }, (err, content) => {
        if (err) {
          this.closeBuffer(buffer.path)
        } else {
          buffer.diskContent = content
          if (buffer.clean) buffer.content = buffer.diskContent
          buffer.clean = buffer.diskContent === buffer.content
          this.watch(buffer)
        }
        this.emitChange()
      })
    })
  }

  closeBuffer(index) {
    if (this.state.buffers.length === 0) return

    // Close active buffer by default
    if (index === undefined) index = this.activeBufferIndex

    var activeBuffer = this.getActiveBuffer()

    if (index === this.activeBufferIndex) {
      if (this.state.buffers.length === 1) {
        this.activeBufferIndex = -1
      } else {
        // Set closest buffer as active
        this.setActiveBuffer(index ? index - 1 : 1)
      }
    } else if (index > this.activeBufferIndex) {
      this.activeBufferIndex--
    }

    // TODO: confirm if buffer is dirty

    this.unwatch(this.state.buffers.splice(index, 1))
  }

  closeAll() {
    this.activeBufferIndex = -1
    this.state.buffers.forEach((buffer) => this.unwatch(buffer))
    this.state.buffers = []
  }

  updateBuffer(data) {
    var buffer = this.state.buffers[data.index]
    buffer.content = data.content
    buffer.clean = buffer.content === buffer.diskContent
  }

  saveBuffer(filePath = false) {
    // Do nothing if we don't have an active buffer
    if (this.activeBufferIndex == -1) return

    var activeBuffer = this.getActiveBuffer()

    this.unwatch(activeBuffer)

    // Use new file path if given (Save as)
    filePath = filePath || activeBuffer.path

    fs.writeFile(filePath, activeBuffer.content, {
      encoding: "utf-8"
    }, (err) => {
      if (err) return console.log(err)

      activeBuffer.path = filePath
      activeBuffer.name = path.basename(filePath)
      activeBuffer.diskContent = activeBuffer.content
      activeBuffer.clean = true
      this.watch(activeBuffer)

      this.emitChange()
      TreeActions.select.defer(filePath)
    })
    return false
  }

  setActiveBuffer(index) {
    if (index === undefined) {
      index = this.state.buffers.length - 1
    }

    var activeBuffer = this.getActiveBuffer()

    if (activeBuffer) activeBuffer.active = false

    this.activeBufferIndex = index
    this.state.buffers[index].active = true

    TreeActions.select.defer(this.state.buffers[index].path)
  }

  watch(buffer) {
    // Close and delete any existing watchers for this file
    this.unwatch(buffer)

    _watchers[buffer.path] = PathWatcher.watch(buffer.path, () => {
      fs.readFile(buffer.path, {
        encoding: "utf-8"
      }, (err, content) => {
        if (err) {
          // File is gone so close it if the buffer is clean
          if (buffer.clean) this.closeBuffer(buffer.path)
          else buffer.diskContent = ""
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
    if (buffer.path && _watchers[buffer.path]) {
      _watchers[buffer.path].close()
      delete _watchers[buffer.path]
    }
  }
}

export default alt.createStore(FileBufferStore, "FileBufferStore")
