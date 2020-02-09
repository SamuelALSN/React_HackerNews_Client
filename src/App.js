import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

require('./App.css')

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

class App extends Component {
  _isMounted = false 
  constructor(props) {
    super(props)

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: '',
      error: null,
      isLoading: false
    }

  }

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm]



  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value })
  }


  setSearchTopStories = result => {
    // console.log(results)
    const { hits, page } = result // recently fetch result from API
    const { searchKey, results } = this.state

    // const oldHits = page !==0 
    //                 ? this.state.results.hits
    //                 : []

    console.log(results) // print the state before any operations


    // these constant is define for the pagination | to avoid new paginated data to overwrite old fetch data when we click on the more button
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : []
    console.log(oldHits) // to see how our results look like


    const updatedHits = [
      ...oldHits,
      ...hits
    ]

    // implementation of the cache with setstates
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    })

    console.log(this.state)

  }


  // TIPS  onSearchSubmit(searchTerm){ avoid redeclaration of variable in function when you declare already in the functions parameters

  onSearchSubmit = event => {
    const { searchTerm } = this.state // we can call it everywhere because it's definied in the constructor
    this.setState({ searchKey: searchTerm })

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }

    event.preventDefault()

  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true})

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }))
  }


  componentDidMount() {
    this._isMounted = true
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
  }

  onDismiss = id => {
    const { results, searchKey } = this.state
    const { hits, page } = results[searchKey]
    const isNotId = item => item.objectID !== id // this functions return item which objectID  is different from the given id
    const updatedHits = hits.filter(isNotId)  // we are removing this object from the results lists with filter

    // we caches the result by recovering results present in state already andd merge with the new seachTerm results ,identified with searchKey
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }



  render() {

    const { searchTerm, results, searchKey, error ,isLoading } = this.state

    // the next variable will store the current data fetch page number 
    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || []


    return (
      <div className='page'>
        <div className='interactions'>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {
          error ?
            <div className="interactions">
              <p>Error to fetch Data </p>
            </div>
            :
            <Table
              list={list}
              onDismiss={this.onDismiss}
            />
        }

        <div className='interactions'>
        { isLoading
          ? <Loading />
          : <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
            > More
           </Button>
        }
        </div>
      </div>
    )
  }
}

const Table = ({ list, onDismiss }) => //{
 // return (
    <div className='table'>
      {list.map(item =>
        <div key={item.objectID} className='table-row'>
          <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}>
            {item.author}
          </span>
          <span style={{ width: '10%' }}>
            {item.num_comments}
          </span>
          <span style={{ width: '10%' }}>
            {item.points}
          </span>
          <span>
            <Button
              onClick={() => onDismiss(item.objectID)}
            >
              Dismiss
          </Button>
          </span>
        </div>
      )}
    </div>
 // )
  Table.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        objectID: PropTypes.string.isRequired,
        author: PropTypes.string,
        url: PropTypes.string,
        num_comments: PropTypes.number,
        points: PropTypes.number,
      })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired
  }
//}

class Search extends Component {
  componentDidMount() {
    if(this.input) {
      this.input.focus()
    }
  }
  render() {
    const {
      searchTerm, 
      onSubmit, 
      children,
      onChange 
    } = this.props

    return (
      <form onSubmit={onSubmit}>
        <input
          type='text'
          value={searchTerm}
          onChange={onChange}
          ref={el => this.input = el}
        />
        <button type='submit'> {children} </button>
      </form>

    //   Search.propTypes = {
    //   searchTerm: PropTypes.string,
    //   onSubmit: PropTypes.func.isRequired,
    //   children: PropTypes.node,
    //   onChange: PropTypes.func.isRequired
    // }
    )
  }
}

 
const Button = ({ onClick, children, className }) => 

    <div>
      <button
        onClick={onClick}
        className={className}
        type='submit'
      >
        {children}
      </button>
    </div>

  Button.defaultProps = {
    className: ''
  }
  Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
    className: PropTypes.string.isRequired
  }

const Loading = () => 
  <div> 
  <i className="fas fa-spinner"></i>
   </div>

export default App

export {
  Button,
  Search,
  Table
}