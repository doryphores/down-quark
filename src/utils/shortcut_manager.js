import Key from "keymaster"
import _ from "underscore"
import FileSystemActions from "../actions/file_system_actions"
import EditorActions from "../actions/editor_actions"

const COMMAND_MODIFIER = process.platform == "darwin" ? "command+" : "ctrl+"

var commands = {
  "o": FileSystemActions.selectFolder,
  "s": EditorActions.saveFile
}

module.exports = {
  registerCommands: () => {
    _.each(commands, (action, shortcut) => {
      Key(COMMAND_MODIFIER + shortcut, action)
    })
  },

  unregisterCommands: () => {
    _.each(commands, (_action, shortcut) => {
      Key.unbind(COMMAND_MODIFIER + shortcut)
    })
  }
}
