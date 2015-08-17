import React from "react"
import Tree from "./tree"

export default class App extends React.Component {
  render() {
    return (
      <div className="u-container  u-container--horizontal">
        <Tree />

        <div className="u-panel  c-workspace">
          <h2>Workspace</h2>
        </div>
      </div>
    )
  }
}
