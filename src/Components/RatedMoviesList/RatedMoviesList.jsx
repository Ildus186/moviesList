import React, { Component } from "react"
import { Pagination, Alert, Spin } from "antd"

import RatedMovie from "../RatedMovie/RatedMovie"

export default class MoviesList extends Component {
  render() {
    const { data, errorRated, changeRatedPage, totalRatedMovies, currentRatedPage } = this.props

    if (!navigator.onLine) {
      return <Alert message="There is no network connection &#128542;" type="warning" showIcon />
    }

    if (errorRated) {
      return (
        <Alert
          message="Error"
          description="This service cannot send a normal result again, or you made a mistake in the request!"
          type="error"
          showIcon
        />
      )
    }

    if (data.length === 0) {
      return <div>You haven't rated the movies yet!</div>
    }

    const elements = data.map((item) => {
      const { id, ...other } = item
      return <RatedMovie key={id} other={other} id={id} />
    })

    return (
      <>
        <ul className="list">{elements}</ul>
        <Pagination
          align="center"
          current={currentRatedPage}
          pageSize={20}
          onChange={changeRatedPage}
          total={totalRatedMovies}
          showSizeChanger={false}
        />
      </>
    )
  }
}
