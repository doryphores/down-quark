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

  componentDidUpdate(prevProps, prevState) {
    // Ensure list is always scrolled to top when opened
    if (this.state.open && !prevState.open) {
      React.findDOMNode(this.refs.listContainer).scrollTop = 0
    }
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

  listItemClassNames(branch) {
    return classNames("c-branch-selector__branch-list-item", {
      "c-branch-selector__branch-list-item--current": branch == this.props.gitStore.currentBranch
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
        <div className="c-branch-selector__branch-list-container" ref="listContainer">
          <ul className="c-branch-selector__branch-list">
            {this.props.gitStore.branchNames.map((branch) => {
              return (
                <li key={branch}
                    className={this.listItemClassNames(branch)}
                    onClick={this.select.bind(this, branch)}>
                  {branch}
                  <i className="octicon-check c-branch-selector__current-icon"/>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}
