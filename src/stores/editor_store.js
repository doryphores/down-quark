import alt from "../alt"
import fs from "fs"
import path from "path"
import _ from "underscore"
import FileSystemActions from "../actions/file_system_actions"
import TabActions from "../actions/tab_actions"
import TreeActions from "../actions/tree_actions"
import PathWatcher from "pathwatcher"

class EditorStore {
  constructor() {
    this.editors = []
    this._watchers = {}
    this._activeEditor = null

    this.bindListeners({
      openEditor      : FileSystemActions.OPEN_FILE,
      closeEditor     : FileSystemActions.CLOSE_FILE,
      setActiveEditor : TabActions.SELECT_TAB
    })
  }

  openEditor(filePath) {
    var existingEditor = this.findEditor(filePath)

    if (existingEditor) {
      // The file is already open so set it as active
      this.setActiveEditor(filePath)
    } else {
      fs.readFile(filePath, (err, content) => {
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

    this.unwatch(filePath)

    this.editors.splice(fileIndex, 1)
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
    this.unwatch(editor.path)

    this._watchers[editor.path] = PathWatcher.watch(editor.path, () => {
      fs.readFile(editor.path, (err, content) => {
        if (err) {
          // File is gone so close it
          this.closeEditor(editor.path)
        } else {
          // File has changed so update it
          editor.diskContent = content
          editor.clean = editor.content === editor.diskContent
        }
        this.emitChange()
      })
    })
  }

  unwatch(filePath) {
    if (this._watchers[filePath]) {
      this._watchers[filePath].close()
      delete this._watchers[filePath]
    }
  }
}

export default alt.createStore(EditorStore, "EditorStore")
