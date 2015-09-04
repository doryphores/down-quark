import alt from "../alt"
import fs from "fs"
import path from "path"
import _ from "underscore"
import async from "async"
import Immutable from "immutable"
import { getShowdownConverter } from "../utils/markdown_converter"
import ProjectStore from "./project_store"
import ProjectActions from "../actions/project_actions"
import FileSystemActions from "../actions/file_system_actions"
import EditorActions from "../actions/editor_actions"
import TabActions from "../actions/tab_actions"
import TreeActions from "../actions/tree_actions"
import PathWatcher from "pathwatcher"

class FileBufferStore {
  static config = {
    onSerialize: (data) => {
      // Ignore empty untitled buffers
      return _.select(data.buffers, (buffer) => {
        return buffer.content.length || buffer.path
      })
    },

    onDeserialize: (data) => {
      return { buffers: data }
    },

    getState: (currentState) => {
      return Immutable.fromJS(currentState)
    }
  }

  constructor() {
    this.state = {
      buffers: []
    }
    this.activeBufferIndex = -1
    this.watchers = {}
    this.converter = null

    this.bindListeners({
      setConverter    : [ProjectActions.OPEN, ProjectActions.RELOAD],
      openBuffer      : FileSystemActions.OPEN,
      closeBuffer     : FileSystemActions.CLOSE,
      saveBuffer      : [
        FileSystemActions.SAVE,
        FileSystemActions.SAVE_AS
      ],
      createBuffer    : FileSystemActions.NEW,
      setActiveBuffer : TabActions.SELECT_TAB,
      updateBuffer    : EditorActions.CHANGE_CONTENT,
      closeAll        : [
        FileSystemActions.OPEN_FOLDER,
        FileSystemActions.CLOSE_ALL
      ]
    })

    this.on("bootstrap", this.reloadBuffers.bind(this))

    this.exportPublicMethods({
      getBuffer         : this.getBuffer.bind(this),
      getActiveBuffer   : this.getActiveBuffer.bind(this),
      getPreviewContent : this.getPreviewContent.bind(this)
    })
  }

  setConverter() {
    this.waitFor(ProjectStore)
    this.converter = getShowdownConverter(ProjectStore.getState().mediaPath)
  }

  getPreviewContent() {
    if (this.activeBufferIndex == -1 || !this.converter) return ""
    return this.converter.makeHtml(this.getActiveBuffer().content)
  }

  getBuffer(index) {
    if (index === undefined) index = this.activeBufferIndex
    return this.state.buffers[index]
  }

  getActiveBuffer() {
    if (this.activeBufferIndex == -1) return undefined
    return this.state.buffers[this.activeBufferIndex]
  }

  findBufferIndex(filePath) {
    return _.findIndex(this.state.buffers, buffer => buffer.path === filePath)
  }

  getUID() {
    return `buffer-${Date.now().toString()}-${this.state.buffers.length}`
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
    var bufferIndex = this.findBufferIndex(filePath)

    if (bufferIndex > -1) {
      // The file is already open so set it as active
      this.setActiveBuffer(bufferIndex)
    } else {
      fs.readFile(filePath, "utf-8", (err, content) => {
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
    async.forEachOf(this.state.buffers, (buffer, index, done) => {
      if (buffer.active) this.activeBufferIndex = index

      // Only reload buffers linked to a file on disk
      if (!buffer.path) return next()

      this.unwatch(buffer)

      fs.readFile(buffer.path, "utf-8", (err, content) => {
        if (err) {
          // File does not exist anymore so close the buffer
          this.closeBuffer(buffer.path)
        } else {
          buffer.diskContent = content
          if (buffer.clean) buffer.content = buffer.diskContent
          buffer.clean = buffer.diskContent === buffer.content
          this.watch(buffer)
        }

        done()
      })
    }, () => {
      // Ensure we set an active buffer
      if (this.activeBufferIndex == -1 && this.state.buffers.length) {
        this.setActiveBuffer(0)
      }
      this.emitChange()
    })
  }

  closeBuffer(index) {
    if (this.state.buffers.length === 0) return

    // Close active buffer by default
    if (index === undefined) index = this.activeBufferIndex

    if (index === this.activeBufferIndex) {
      if (this.state.buffers.length === 1) {
        this.activeBufferIndex = -1
      } else {
        // Set closest buffer as active
        this.setActiveBuffer(index ? index - 1 : 1)
      }
    }

    if (index < this.activeBufferIndex) {
      this.activeBufferIndex--
    }

    this.unwatch(this.state.buffers.splice(index, 1))
  }

  closeAll() {
    this.activeBufferIndex = -1
    this.state.buffers.forEach((buffer) => this.unwatch(buffer))
    this.state.buffers = []
  }

  updateBuffer(data) {
    let buffer = this.state.buffers[data.index]
    buffer.content = data.content
    buffer.clean = buffer.content === buffer.diskContent
  }

  saveBuffer({index, filePath = "", closeOnSave = false} = {}) {
    let buffer = this.getBuffer(index)

    if (!buffer) return

    this.unwatch(buffer)

    // Use new file path if given (Save as)
    filePath = filePath || buffer.path

    fs.writeFile(filePath, buffer.content, "utf-8", (err) => {
      if (err) return console.log(err)

      if (closeOnSave) {
        this.closeBuffer(index)
      } else {
        buffer.path = filePath
        buffer.name = path.basename(filePath)
        buffer.diskContent = buffer.content
        buffer.clean = true
        this.watch(buffer)
        TreeActions.select.defer(filePath)
      }

      this.emitChange()
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

    this.watchers[buffer.path] = PathWatcher.watch(buffer.path, () => {
      fs.readFile(buffer.path, "utf-8", (err, content) => {
        if (err) {
          // File is gone so close it if the buffer is clean
          if (buffer.clean) this.closeBuffer(this.findBufferIndex(buffer.path))
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
    if (buffer.path && this.watchers[buffer.path]) {
      this.watchers[buffer.path].close()
      delete this.watchers[buffer.path]
    }
  }
}

export default alt.createStore(FileBufferStore, "FileBufferStore")
