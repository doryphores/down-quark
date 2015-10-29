import React from "react"
import ReactDOM from "react-dom"
import BaseComponent from "../base_component"
import classNames from "classnames"

export default class BranchSelector extends BaseComponent {
  constructor(props) {
    super(props)

    this.state = this.initialState()

    this.docEvents = {
      handleEvent: (e) => {
        // Ignore clicks on this component
        if (ReactDOM.findDOMNode(this).contains(e.target)) {
          return
        }

        this.close()
      }
    }
  }

  initialState() {
    return {
      open           : false,
      selectedBranch : "",
      filter         : "",
      scroll         : false
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.docEvents, false)
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.docEvents, false)
  }

  componentDidUpdate(prevProps, prevState) {
    // Ensure list is always scrolled to top when opened
    if (this.state.open && !prevState.open) {
      this.refs.filter.focus()
      this.refs.listScroller.scrollTop = 0
    }

    if (this.state.scroll) {
      ReactDOM.findDOMNode(this).querySelector(".c-branch-selector__item--selected").scrollIntoView(this.state.scroll == "top")
    }
  }

  toggle() {
    if (this.state.open) {
      this.close()
    } else {
      this.setState({
        open: true
      })
    }
  }

  close() {
    this.setState(this.initialState())
  }

  select(branch) {
    let selectedBranch = branch || this.state.selectedBranch;
    if (selectedBranch) {
      this.context.flux.getActions("GitActions").checkoutBranch(selectedBranch)
    }
    this.close()
  }

  moveFocusDown() {
    let branches = this.filteredBranches()
    let currentIndex = branches.indexOf(this.state.selectedBranch)
    if (currentIndex + 1 == branches.length) {
      return
    }
    this.setState({
      selectedBranch: branches[currentIndex + 1],
      scroll: "bottom"
    })
  }

  moveFocusUp() {
    let branches = this.filteredBranches()
    let currentIndex = branches.indexOf(this.state.selectedBranch)
    if (currentIndex == 0) {
      return
    }
    this.setState({
      selectedBranch: branches[currentIndex - 1],
      scroll: "top"
    })
  }

  handleFilterChange(e) {
    this.setState({
      filter         : e.target.value,
      selectedBranch : "",
      scroll: false
    })
  }

  handleKeyDown(e) {
    switch(e.which) {
      case 40: // DOWN
        this.moveFocusDown()
        break
      case 38: // UP
        this.moveFocusUp()
        break
      case 13: // ENTER
        this.select()
        break
      case 27: // ESC
        this.close()
        break
    }
  }

  filteredBranches() {
    if (this.state.filter) {
      return this.props.gitStore.branchNames.filter(b => b.indexOf(this.state.filter) > -1)
    } else {
      return this.props.gitStore.branchNames
    }
  }

  componentClassNames() {
    return classNames("c-branch-selector js-container", {
      "c-branch-selector--open": this.state.open
    })
  }

  listItemClassNames(branch) {
    return classNames("c-branch-selector__item", {
      "c-branch-selector__item--current": branch == this.props.gitStore.currentBranch,
      "c-branch-selector__item--selected": branch == this.state.selectedBranch
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
        <div className="c-branch-selector__menu" onKeyDown={this.handleKeyDown.bind(this)}>
          <div className="c-branch-selector__filter">
            <input type="text"
                   ref="filter"
                   value={this.state.filter}
                   placeholder="Find a branch&hellip;"
                   onChange={this.handleFilterChange.bind(this)}/>
          </div>
          <div className="c-branch-selector__scroller" ref="listScroller">
            <ul className="c-branch-selector__list">
              {this.filteredBranches().map((branch) => {
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
      </div>
    )
  }
}
