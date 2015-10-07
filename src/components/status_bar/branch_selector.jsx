import React from "react"
import BaseComponent from "../base_component"
import classNames from "classnames"

export default class BranchSelector extends BaseComponent {
  constructor() {
    super()

    this.state = {
      open: false
    }

    this.docEvents = {
      handleEvent: (e) => {
        // Ignore clicks on this component
        if (e.type == "click" && React.findDOMNode(this).contains(e.target)) {
          return
        }

        // Ignore key presses other than ESC
        if (e.type == "keyup" && e.keyCode != 27) {
          return
        }

        this.close()
      }
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.docEvents, false)
    document.addEventListener("keyup", this.docEvents, false)
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.docEvents, false)
    document.removeEventListener("keyup", this.docEvents, false)
  }

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  close() {
    this.setState({
      open: false
    })
  }

  select(branch) {
    this.context.flux.getActions("GitActions").checkoutBranch(branch)
    this.close()
  }

  componentClassNames() {
    return classNames("c-branch-selector js-container", {
      "c-branch-selector--open": this.state.open
    })
  }

  render() {
    return (
      <div className={this.componentClassNames()}>
        <strong className="c-branch-selector__current" onClick={this.toggle.bind(this)}>
          {this.props.gitStore.currentBranch}
          <i className="c-branch-selector__icon c-branch-selector__icon--closed octicon-chevron-down"/>
          <i className="c-branch-selector__icon c-branch-selector__icon--open octicon-chevron-up"/>
        </strong>
        <ul className="c-branch-selector__branch-list">
          {this.props.gitStore.branches.map((branch) => {
            return (
              <li key={branch.name}
                  className="c-branch-selector__branch-list-item"
                  onClick={this.select.bind(this, branch)}>
                {branch.name}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
