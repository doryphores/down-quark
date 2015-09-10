import React from "react"
import classNames from "classnames"
import _ from "underscore"

export default class TabBar extends React.Component {
  static contextTypes = {
    flux : React.PropTypes.object
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.buffers.length != this.props.buffers.length) return true
    return _.some(nextProps.buffers, (b, i) => {
      return b !== this.props.buffers[i]
    })
  }

  tabClasses(buffer) {
    return classNames("c-tab-bar__item", {
      "c-tab-bar__item--active" : buffer.active,
      "c-tab-bar__item--dirty"  : !buffer.clean
    })
  }

  handleClick(index, event) {
    if (event.target.classList.contains("js-close")) {
      this.context.flux.getActions("TabActions").close(index)
    } else {
      this.context.flux.getActions("TabActions").select(index)
    }
  }

  render() {
    if (!this.props.buffers.length) return null

    return(
      <ul className={classNames(this.props.className, "c-tab-bar")}>
        {this.props.buffers.map((buffer, index) => {
          return (
            <li key={buffer.id}
                className={this.tabClasses(buffer)}
                onClick={this.handleClick.bind(this, index)}>
              <span>{buffer.name}</span>
              <span className="c-tab-bar__close  js-close"/>
            </li>
          )
        })}
      </ul>
    )
  }
}
