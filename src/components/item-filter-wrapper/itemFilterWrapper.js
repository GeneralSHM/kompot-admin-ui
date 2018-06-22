import React, { Component } from 'react';
import './itemFilterWrapper.css';
import SearchInput, {createFilter} from 'react-search-input'
import Select from 'react-select';

class FilterPrice extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    return(
      <div className="filter-price-wrapper">
        <input type="text" className="filter-price-input" placeholder="From"/>
        <input type="text" className="filter-price-input" placeholder="To"/>
      </div>
    );
  }
}

class ItemFilterWrapper extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      brands: props.brands,
      stores: props.stores,
      searchTerm: props.searchTerm,
      selectedBrandOptions: '',
      selectedStoreOptions: ''
    };

    this.searchUpdated = this.searchUpdated.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.updateProductFunction = props.updateProductFunction;
    this.updateHashForPagination = props.updateHashForPagination;
    this.changePagination = props.changePagination;
  }

  handleStoreChange(value) {
    this.setState({
      selectedStoreOptions: value
    });
  }

  handleBrandChange(value) {
    this.setState({
      selectedBrandOptions: value
    });
  }

  addHashForSearchTerm(searchTerm) {
    this.updateHashForPagination(1, 20);
    this.changePagination(1, 20);
    searchTerm = encodeURIComponent(searchTerm);
    let currentHash = window.location.hash;
    const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
    if (currentHash.indexOf('search') !== -1) {
      let regex = isThereMoreThanOneParam ? /search=.*?&/ : /search=.*/;
      let newHash = currentHash.replace(regex, `search=${searchTerm}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&search=${searchTerm}&` : `search=${searchTerm}&`;
    }

    this.updateProductFunction();
  }

  searchUpdated(term) {
    this.setState({searchTerm: term}, () => {
      this.addHashForSearchTerm(term);
    })
  }

  render() {
    return (
      <div className="filter-options">
        <div className="search-wrapper">
          <SearchInput value={this.state.searchTerm} className="search-input" onChange={this.searchUpdated} />
        </div>
        <div className="filter-brand-wrapper">
          <Select
            multi
            name="form-brand-select"
            value={this.state.selectedBrandOptions}
            onChange={this.handleBrandChange}
            options={this.state.brands}
            removeSelected={this.state.removeSelected}
            placeholder="Brands..."
          />
        </div>
        <div className="filter-brand-wrapper">
          <Select
            multi
            name="form-brand-select"
            value={this.state.selectedStoreOptions}
            onChange={this.handleStoreChange}
            options={this.state.stores}
            removeSelected={this.state.removeSelected}
            placeholder="Stores..."
          />
        </div>
        <FilterPrice/>
        <button className="filter-button">Filter</button>
      </div>
    );
  }
}


export default ItemFilterWrapper;