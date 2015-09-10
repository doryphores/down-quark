import React from "react"

export default class BaseComponent extends React.Component {
  static contextTypes = {
    flux : React.PropTypes.object
  }
}
