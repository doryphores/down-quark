import alt from "../alt"
import _ from "underscore"
import Buffer from "../models/buffer"
import {getShowdownConverter} from "../utils/markdown_converter"
import ProjectStore from "./project_store"
import ProjectActions from "../actions/project_actions"
import FileSystemActions from "../actions/file_system_actions"
import EditorActions from "../actions/editor_actions"
import TabActions from "../actions/tab_actions"
import TreeActions from "../actions/tree_actions"

class BufferStore {
  static displayName = "BufferStore"

  static config = {
    onSerialize: (data) => {
      return {
        buffers: data.buffers.map(b => b.memo()),
        activeBufferIndex: data.activeBufferIndex
      }
    },

    onDeserialize: (data) => {
      return {
        buffers: data.buffers.map(b => new Buffer(b)),
        activeBufferIndex: data.activeBufferIndex
      }
    },

    getState: (currentState) => {
      return {
        buffers: currentState.buffers.map(b => b.memo()),
        activeBufferIndex: currentState.activeBufferIndex
      }
    }
  }

  constructor() {
    this.state = {
      buffers: [],
      activeBufferIndex: -1
    }

    this.on("bootstrap", () => {
      this.state.buffers.forEach((buffer) => {
        buffer.on("change", this.emitChange.bind(this))
      })
    })

    this.bindListeners({
      setConverter    : [ProjectActions.OPEN, ProjectActions.RELOAD],
      openBuffer      : FileSystemActions.OPEN,
      closeBuffer     : FileSystemActions.CLOSE,
      saveBuffer      : [
        FileSystemActions.SAVE,
        FileSystemActions.SAVE_AS
      ],
      newBuffer       : FileSystemActions.NEW,
      setActiveBuffer : TabActions.SELECT_TAB,
      updateBufferContent : EditorActions.CHANGE_CONTENT,
      closeAll        : [
        FileSystemActions.OPEN_FOLDER,
        FileSystemActions.CLOSE_ALL
      ]
    })

    this.exportPublicMethods({
      getBuffer         : this.getBuffer.bind(this),
      getPreviewContent : this.getPreviewContent.bind(this)
    })
  }

  setConverter() {
    this.waitFor(ProjectStore)
    this.converter = getShowdownConverter(ProjectStore.getState().mediaPath)
  }

  getBuffer(index) {
    if (index === undefined) index = this.state.activeBufferIndex
    return this.state.buffers[index]
  }

  getPreviewContent() {
    if (this.state.activeBufferIndex == -1 || !this.converter) return ""
    return this.converter.makeHtml(this.getBuffer().content)
  }

  addBuffer(buffer) {
    this.setActiveBuffer(this.state.buffers.push(buffer) - 1)
    buffer.on("change", this.emitChange.bind(this))
  }

  newBuffer() {
    this.addBuffer(new Buffer())
  }

  openBuffer(filePath) {
    let bufferIndex = _.findIndex(this.state.buffers, b => b.filePath == filePath)
    if (bufferIndex > -1) this.setActiveBuffer(bufferIndex)
    else this.addBuffer(new Buffer({filePath: filePath}))
  }

  closeBuffer(index) {
    if (index === undefined) index = this.state.activeBufferIndex
    if (index == -1) return

    if (index == this.state.activeBufferIndex) {
      if (this.state.buffers.length == 1) {
        this.state.activeBufferIndex = -1
      } else {
        this.setActiveBuffer(index ? index - 1 : 1)
      }
    }

    if (index < this.state.activeBufferIndex) {
      this.state.activeBufferIndex--
    }

    this.state.buffers.splice(index, 1)[0].cleanup()
  }

  closeAll() {
    for (let i = this.state.buffers.length - 1; i >= 0; i--) {
      this.closeBuffer(i)
    }
  }

  setActiveBuffer(index) {
    if (index == this.state.activeBufferIndex) return
    if (this.state.activeBufferIndex > -1) {
      let activeBuffer = this.getBuffer(this.state.activeBufferIndex)
      if (activeBuffer) activeBuffer.deactivate()
    }
    this.getBuffer(index).activate()
    this.state.activeBufferIndex = index
  }

  updateBufferContent({id, content} = {}) {
    let buffer = _.findWhere(this.state.buffers, {id: id})
    if (buffer) buffer.updateContent(content)
  }

  saveBuffer({index, filePath, closeOnSave = false} = {}) {
    this.getBuffer(index).save(filePath)
    if (closeOnSave) this.closeBuffer(index)
  }
}

export default alt.createStore(BufferStore)