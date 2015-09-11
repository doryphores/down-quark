import clipboard from "clipboard"

const COMMANDS = {
  undo: (editorInstance) => {
    editorInstance.execCommand("undo")
  },

  redo: (editorInstance) => {
    editorInstance.execCommand("redo")
  },

  cut: (editorInstance) => {
    clipboard.writeText(editorInstance.getSelection())
    editorInstance.replaceSelection("")
  },

  copy: (editorInstance) => {
    let selection = editorInstance.getSelection()
    if (selection) clipboard.writeText(editorInstance.getSelection())
  },

  paste: (editorInstance) => {
    editorInstance.replaceSelection(clipboard.readText())
  },

  selectAll: (editorInstance) => {
    editorInstance.execCommand("selectAll")
  }
}

function EditorCommands() {
  this.editorInstance = null

  const bind = (editorInstance) => {
    this.editorInstance = editorInstance
  }

  const unbind = (editorInstance) => {
    if (this.editorInstance === editorInstance) {
      this.editorInstance = null
    }
  }

  const send = (command) => {
    if (this.editorInstance && command in COMMANDS) {
      COMMANDS[command](this.editorInstance)
    }
  }

  return { bind, unbind, send }
}

export default new EditorCommands()
