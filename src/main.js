import initWindow from "./utils/window"
import React from "react"
import ReactDOM from "react-dom"
import Flux from "./flux"
import withAltContext from "alt/utils/withAltContext"
import App from "./components/app"

initWindow()

ReactDOM.render(
  React.createElement(withAltContext(new Flux())(App)),
  document.getElementById("app")
)
