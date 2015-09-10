import initWindow from "./utils/window"
import React from "react"
import Flux from "./alt"
import withAltContext from "alt/utils/withAltContext"
import App from "./components/app"

initWindow()

React.render(
  React.createElement(withAltContext(new Flux())(App)),
  document.getElementById("app")
)
