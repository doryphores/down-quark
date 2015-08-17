import initWindow from "./utils/window"
import compileCSS from "./utils/styles"
import React from "react"
import path from "path"
import remote from "remote"
import App from "./components/app"

compileCSS(path.resolve(__dirname, "../static/css/app.styl"))
  .then(function renderApp() {
    initWindow()
    React.render(<App />, document.getElementById("app"))
  }).catch(function logError(err) {
    remote.require("app").quit()
    console.log(err.message)
  })
