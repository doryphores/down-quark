import CodeMirror from "codemirror"
import _ from "underscore"

require("codemirror/addon/mode/multiplex")
require("codemirror/addon/edit/trailingspace")

// Load modes
_.each([
  "markdown",
  "yaml"
], mode => require(`codemirror/mode/${mode}/${mode}`))

CodeMirror.defineMode("frontmatter_markdown", (config) => {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, {
      name: "markdown",
      highlightFormatting: true,
      fencedCodeBlocks: true
    }),
    {
      open       : "---",
      close      : "---",
      mode       : CodeMirror.getMode(config, "text/x-yaml"),
      delimStyle : "front-matter-delim"
    }
  )
})

export default CodeMirror
