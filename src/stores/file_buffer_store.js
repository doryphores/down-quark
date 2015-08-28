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
        buffers: data,
        activeBuffer: _.find(data, (buffer) => {
          return buffer.active
        })
      }
    },

    getState: (currentState) => {
      return Immutable.fromJS(currentState)
    }
  }

  constructor() {
    this.state = {
      buffers      : [],
      activeBuffer : null
    }

    this.bindListeners({
      openBuffer      : FileSystemActions.OPEN_FILE,
      closeBuffer     : FileSystemActions.CLOSE_FILE,
      saveBuffer      : FileSystemActions.SAVE,
      saveBuffer      : FileSystemActions.SAVE_AS,
      createBuffer    : FileSystemActions.NEW_FILE,
      setActiveBuffer : TabActions.SELECT_TAB,
      updateBuffer    : EditorActions.CHANGE_CONTENT,
      closeAll        : FileSystemActions.OPEN_FOLDER
    })

    this.on("bootstrap", this.reloadBuffers.bind(this))
  }

  createBuffer() {
    this.state.buffers.push({
      path        : "",
      name        : "untitled",
      content     : "",
      diskContent : "",
      clean       : true,
      active      : false
    })

    this.setActiveBuffer(this.state.buffers.length - 1)
    this.emitChange()
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
          active      : false
        })

        this.watch(_.last(this.state.buffers))
        this.setActiveBuffer(this.state.buffers.length - 1)
        this.emitChange()
      })
      // We are reading the file content asynchronously so do not
      // emit a change event
      return false
    }
  }

  reloadBuffers() {
    this.state.buffers.forEach((buffer) => {
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
    if (index === undefined) {
      index = _.findIndex(this.state.buffers, (buffer) => {
        return buffer.path === this.state.activeBuffer.path
      })

      if (this.state.buffers.length === 1) {
        this.state.activeBuffer = null
      } else {
        // Set closest buffer as active
        this.setActiveBuffer(index ? index - 1 : 1)
      }
    }

    // TODO: confirm if buffer is dirty

    this.unwatch(this.state.buffers.splice(index, 1))
  }

  closeAll() {
    for (let i = this.state.buffers.length - 1; i > -1; i--) {
      this.closeBuffer(this.state.buffers[i].path)
    }
  }

  updateBuffer(data) {
    var buffer = this.state.buffers[data.index]
    buffer.content = data.content
    buffer.clean = buffer.content === buffer.diskContent
  }

  saveBuffer(filePath = false) {
    // Do nothing if we don't have an active buffer
    if (!this.state.activeBuffer) return

    this.unwatch(this.state.activeBuffer)

    // Use new file path if given (Save as)
    filePath = filePath || this.state.activeBuffer.path

    fs.writeFile(filePath, this.state.activeBuffer.content, {
      encoding: "utf-8"
    }, (err) => {
      if (err) return console.log(err)

      this.state.activeBuffer.path = filePath
      this.state.activeBuffer.name = path.basename(filePath)
      this.state.activeBuffer.diskContent = this.state.activeBuffer.content
      this.state.activeBuffer.clean = true
      this.watch(this.state.activeBuffer)

      this.emitChange()
      TreeActions.select.defer(filePath)
    })
    return false
  }

  setActiveBuffer(index) {
    if (this.state.activeBuffer) {
      this.state.activeBuffer.active = false
    }

    this.state.activeBuffer = this.state.buffers[index]

    if (this.state.activeBuffer) {
      this.state.activeBuffer.active = true
    }

    TreeActions.select.defer(this.state.activeBuffer.path)
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
