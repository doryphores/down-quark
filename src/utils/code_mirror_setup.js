import CodeMirror from "codemirror"

require("codemirror/mode/markdown/markdown")
require("codemirror/mode/yaml/yaml")
require("codemirror/addon/mode/multiplex")
require("codemirror/addon/edit/trailingspace")

CodeMirror.defineMode("frontmatter_markdown", (config) => {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "text/x-markdown"),
    {
      open       : "---",
      close      : "---",
      mode       : CodeMirror.getMode(config, "text/x-yaml"),
      delimStyle : "delimit"
    }
  )
})

export default CodeMirror
