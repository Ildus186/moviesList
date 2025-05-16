import { Component } from 'react'
import './App.css'
import { Tabs } from 'antd'

import MoviesList from './Components/MoviesList/MoviesList'
import RatedMoviesList from './Components/RatedMoviesList/RatedMoviesList'
import SearchMovie from './Components/SearchMovie/SearchMovie'
import { GenresProvider } from './Components/GenresContext/GenresContext'

export default class App extends Component {
  state = {
    data: [],
    genres: [],
    totalMovies: null,
    isLoading: false,
    error: null,
    errorRated: null,
    currentPage: 1,
    currentRatedPage: 1,
    query: 'return',
    newTab: 'Search',
    guestSessionId: null,
    ratedMovies: [],
    totalRatedMovies: null,
  }

  componentDidMount() {
    this.getMovies()
    this.getGenres()
    this.createGuestSession()
  }

  changeTab = (newTab) => {
    this.setState({
      newTab: newTab,
      currentPage: 1,
      currentRatedPage: 1,
    })
  }

  changePage = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getMovies()
      },
    )
  }

  changeRatedPage = (page) => {
    this.setState(
      {
        currentRatedPage: page,
      },
      () => {
        this.getRatedMovies()
      },
    )
  }

  changeQuery = (query) => {
    this.setState(
      {
        query: query,
      },
      () => {
        this.getMovies()
      },
    )
  }

  createGuestSession = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=9f36f1f6e5e5000e0da211b3f98ec3ad`,
      )
      const session = await response.json()

      if (session.success) {
        console.log(session.guest_session_id)
        this.setState({ guestSessionId: session.guest_session_id })
      } else {
        console.error('Failed to create guest session:', session)
      }
    } catch (error) {
      console.error('Error creating guest session:', error)
    }
  }

  getRatedMovies = async () => {
    const { guestSessionId, currentRatedPage } = this.state
    if (guestSessionId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=9f36f1f6e5e5000e0da211b3f98ec3ad&language=ru-RU&page=${currentRatedPage}`,
        )
        if (!response.ok) {
          this.setState({ errorRated: true })
          throw new Error('Network response was not ok')
        }
        this.setState({ errorRated: false })
        const data = await response.json()
        console.log(data)
        this.setState({
          ratedMovies: data.results,
          totalRatedMovies: data.total_results,
        })
      } catch (error) {
        console.error('Error fetching rated movies:', error)
        this.setState({ errorRated: true })
      }
    }
  }

  getMovies = async () => {
    this.setState({ isLoading: true, error: null })
    try {
      const { currentPage, query } = this.state
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`,
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjM2ZjFmNmU1ZTUwMDBlMGRhMjExYjNmOThlYzNhZCIsIm5iZiI6MTc0NTI1NzMxMy44OTc5OTk4LCJzdWIiOiI2ODA2ODM2MTQyMWEzMDk3NWNhYWNhNzAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.A-_NMdxuoMeRUwTAJHSoxI7pvyz4Swz1QRiwElvshBg',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const movies = await response.json()
      this.setState({
        data: movies.results,
        totalMovies: movies.total_results,
        isLoading: false,
      })
    } catch (error) {
      console.error('There was a problem fetching the data:', error)
      this.setState({
        error: error.message,
        isLoading: false,
      })
    }
  }

  getGenres = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=en`, {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjM2ZjFmNmU1ZTUwMDBlMGRhMjExYjNmOThlYzNhZCIsIm5iZiI6MS43NDUyNTczMTM4OTc5OTk4ZSs5LCJzdWIiOiI2ODA2ODM2MTQyMWEzMDk3NWNhYWNhNzAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FWM9blBaCBaooaCGRKwhQpGZr3OibtPM-ELH8wskHzg',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const genres = await response.json()
      this.setState({
        genres: genres.genres,
      })
    } catch (error) {
      console.error('There was a problem fetching the data:', error)
      this.setState({
        error: error.message,
      })
    }
  }

  render() {
    const {
      data,
      isLoading,
      error,
      errorRated,
      currentPage,
      currentRatedPage,
      totalMovies,
      totalRatedMovies,
      activeKey,
      genres,
      guestSessionId,
      ratedMovies,
    } = this.state
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <>
            <GenresProvider value={genres}>
              <SearchMovie changeQuery={this.changeQuery} changePage={this.changePage} />
              <MoviesList
                data={data}
                changePage={this.changePage}
                currentPage={currentPage}
                totalMovies={totalMovies}
                isLoading={isLoading}
                error={error}
                guestSessionId={guestSessionId}
                getRatedMovies={this.getRatedMovies}
              />
            </GenresProvider>
          </>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <>
            <GenresProvider value={genres}>
              <RatedMoviesList
                data={ratedMovies}
                changeRatedPage={this.changeRatedPage}
                currentRatedPage={currentRatedPage}
                totalRatedMovies={totalRatedMovies}
                isLoading={isLoading}
                error={error}
                errorRated={errorRated}
              />
            </GenresProvider>
          </>
        ),
      },
    ]

    return <Tabs centered activeKey={activeKey} items={items} onChange={this.changeTab} />
  }
}
