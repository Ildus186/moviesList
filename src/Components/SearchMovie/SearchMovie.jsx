import React, { Component } from "react"
import { debounce } from "lodash"

import "./SearchMovie.css"

export default class SearchMovie extends Component {
  state = {
    label: "",
  }

  debounceChangeQuery = debounce((query) => {
    this.props.changeQuery(query)
  }, 400)

  onLabelChange = (e) => {
    const newLabel = e.target.value
    this.setState(
      {
        label: newLabel,
      },
      () => {
        this.debounceChangeQuery(newLabel)
      }
    )
    this.props.changePage(1)
  }

  onSubmit = (e) => {
    e.preventDefault()
    // this.setState({ label: '' });
  }

  render() {
    return (
      <>
        <form className="searchForm" onSubmit={this.onSubmit}>
          <input className="searchInput" value={this.state.label} onChange={this.onLabelChange} placeholder="Type to search..." autoFocus></input>
        </form>
      </>
    )
  }
}
