import React, { Component } from 'react';
import './App.css';
//import List from "./components/List"


const getHackerNewsUrl = (value, page) =>
  `https://hn.algolia.com/api/v1/search?query=${value}&page=${page}&hitsPerPage=100`;


const applyUpdateResult = (result) => (prevState) => ({
    hits: [...prevState.hits, ...result.hits],
    page: result.page,
    isLoading: false
  });

const applySetResult = (result) => (prevState) => ({
    hits: result.hits,
    page: result.page,
    isLoading: false
  });

class App extends Component {
constructor(props){
    super(props);
    this.state = {
      hits: [],
      page: null,
      isLoading: false,
    }
}

onInitialSearch = (e) => {
  e.preventDefault();
  const { value } = this.input;
  if (value === '') {
    return;
  }
  this.fetchStories(value, 0);
 }

 onPaginatedSearch = (e) =>
    this.fetchStories(this.input.value, this.state.page + 1);


 fetchStories = (value, page) => {
    fetch(getHackerNewsUrl(value, page))
      .then(response => response.json())
      .then(result => this.onSetResult(result, page));
  }

  onSetResult = (result, page) =>
    page === 0
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));

  render() {
    return (
      <div className="page">
        <div className="interactions">
          <form type="submit" onSubmit={this.onInitialSearch}>
            <input type="text" ref={node => this.input = node} />
            <button type="submit">Search</button>
          </form>
        </div>

        <List
          list={this.state.hits}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
        />
      </div>
    )
  }
}

const List = ({ list, page, isLoading, onPaginatedSearch }) =>
  <div>
    <div className="list">
      {list.map(item => <div className="list-row" key={item.objectID}>
        <a href={item.url}>{item.title}</a>
      </div>)}
    </div>

    <div className="interactions">
      {isLoading && <span>Loading...</span>}
    </div>

    <div className="interactions">
      {
        (page !== null && !isLoading) &&
        <button
          type="button"
          onClick={onPaginatedSearch}
        >
          More
        </button>
      }
    </div>


  </div>

export default App;