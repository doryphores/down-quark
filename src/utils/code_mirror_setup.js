import CodeMirror from "codemirror"
import _ from "underscore"

require("codemirror/addon/mode/multiplex")
require("codemirror/addon/edit/trailingspace")

// Load modes
_.each([
  "gfm",
  "javascript",
  "ruby",
  "coffeescript",
  "css",
  "sass",
  "stylus",
  "yaml"
], mode => require(`codemirror/mode/${mode}/${mode}`))

CodeMirror.defineMode("frontmatter_markdown", (config) => {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "text/x-gfm"),
    {
      open            : /^\b.+\b: .*|^---$/,
      close           : /^---$/,
      mode            : CodeMirror.getMode(config, "text/x-yaml"),
      parseDelimiters : true
    }
  )
})

export default CodeMirror
