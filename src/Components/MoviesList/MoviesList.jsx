import React, { Component } from 'react'
import { Pagination, Alert, Spin } from 'antd'

import Movie from '../Movie/Movie'

import './MoviesList.css'

export default class MoviesList extends Component {
  state = {
    ratings: {},
  }

  handleRatingChoice = (movieId, rating) => {
    this.setState((prevState) => ({
      ratings: {
        ...prevState.ratings,
        [movieId]: rating,
      },
    }))
  }

  render() {
    const {
      data,
      currentPage,
      changePage,
      totalMovies,
      isLoading,
      error,
      guestSessionId,
      getRatedMovies,
    } = this.props

    const elements = data.map((item) => {
      const { id, ...other } = item
      return (
        <Movie
          key={id}
          other={other}
          id={id}
          guestSessionId={guestSessionId}
          getRatedMovies={getRatedMovies}
          handleRatingChoice={this.handleRatingChoice}
          rating={this.state.ratings[id]}
        />
      )
    })

    const contentStyle = {
      padding: 100,
      background: 'transparent',
    }

    const content = <div style={contentStyle} />
    if (!navigator.onLine) {
      return <Alert message="There is no network connection &#128542;" type="warning" showIcon />
    }

    if (isLoading) {
      return (
        <Spin tip="Loading" size="large">
          {content}
        </Spin>
      )
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description="The request did not give positive results."
          type="error"
          showIcon
        />
      )
    }

    if (data.length === 0) {
      return <div>There are no matches for this query!</div>
    }

    return (
      <>
        <ul className="list">{elements}</ul>
        <Pagination
          align="center"
          current={currentPage}
          pageSize={20}
          onChange={changePage}
          total={totalMovies}
          showSizeChanger={false}
        />
      </>
    )
  }
}
