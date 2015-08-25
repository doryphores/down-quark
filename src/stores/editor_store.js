import alt from "../alt"
import fs from "fs"
import path from "path"
import _ from "underscore"
import FileSystemActions from "../actions/file_system_actions"
import EditorActions from "../actions/editor_actions"
import TabActions from "../actions/tab_actions"
import TreeActions from "../actions/tree_actions"
import PathWatcher from "pathwatcher"

// TODO: rename this to FileBufferStore?

class EditorStore {
  constructor() {
    this.editors = []
    this._watchers = {}
    this._activeEditor = null

    this.bindListeners({
      openEditor      : FileSystemActions.OPEN_FILE,
      closeEditor     : FileSystemActions.CLOSE_FILE,
      setActiveEditor : TabActions.SELECT_TAB,
      changeContent   : EditorActions.CHANGE_CONTENT,
      saveFile        : EditorActions.SAVE_FILE
    })
  }

  openEditor(filePath) {
    var existingEditor = this.findEditor(filePath)

    if (existingEditor) {
      // The file is already open so set it as active
      this.setActiveEditor(filePath)
    } else {
      fs.readFile(filePath, {
        encoding: "utf-8"
      }, (err, content) => {
        if (err) console.log(err)
        else {
          this.editors.push({
            path        : filePath,
            name        : path.basename(filePath),
            content     : content,
            diskContent : content,
            clean       : true,
            active      : false
          })
          this.watch(_.last(this.editors))
          this.setActiveEditor(filePath)
          this.emitChange()
        }
      })
      // We are reading the file content asynchronously so do not
      // emit a change event
      return false
    }
  }

  closeEditor(filePath) {
    if (this.editors.length === 0) return

    // Close active editor by default
    if (filePath === undefined) filePath = this._activeEditor.path

    var fileIndex = _.findIndex(this.editors, (editor) => {
      return editor.path === filePath
    })

    if (fileIndex === -1) return

    if (filePath === this._activeEditor.path) {
      if (this.editors.length === 1) {
        this._activeEditor = null
      } else {
        this.setActiveEditor(this.editors[fileIndex ? fileIndex - 1 : 1].path)
      }
    }

    this.unwatch(this.editors.splice(fileIndex, 1))
  }

  changeContent(data) {
    var editor = this.findEditor(data.filePath)
    editor.content = data.content
    editor.clean = editor.content === editor.diskContent
  }

  saveFile() {
    this.unwatch(this._activeEditor)
    fs.writeFile(this._activeEditor.path, this._activeEditor.content, {
      encoding: "utf-8"
    }, (err) => {
      if (err) return console.log(err)
      this._activeEditor.diskContent = this._activeEditor.content
      this._activeEditor.clean = true
      this.watch(this._activeEditor)
      this.emitChange()
    })
    return false
  }

  setActiveEditor(filePath) {
    if (this._activeEditor) {
      this._activeEditor.active = false
    }

    this._activeEditor = this.findEditor(filePath)

    if (this._activeEditor) {
      this._activeEditor.active = true
    }

    // Select active tree node
    TreeActions.select.defer(filePath)
  }

  findEditor(filePath) {
    return _.find(this.editors, (editor) => {
      return editor.path === filePath
    })
  }

  watch(editor) {
    // Close and delete any existing watchers for this file
    this.unwatch(editor)

    this._watchers[editor.path] = PathWatcher.watch(editor.path, () => {
      fs.readFile(editor.path, (err, content) => {
        if (err) {
          // File is gone so close it
          this.closeEditor(editor.path)
        } else {
          // File has changed so update it
          if (editor.clean) editor.content = content
          editor.diskContent = content
          editor.clean = editor.content === editor.diskContent
        }
        this.emitChange()
      })
    })
  }

  unwatch(editor) {
    if (this._watchers[editor.path]) {
      this._watchers[editor.path].close()
      delete this._watchers[editor.path]
    }
  }
}

export default alt.createStore(EditorStore, "EditorStore")
