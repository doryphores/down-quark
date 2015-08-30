import initWindow from "./utils/window"
import React from "react"
import App from "./components/app"

initWindow()
React.render(<App />, document.getElementById("app"))
