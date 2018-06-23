import React, { Component } from 'react';
import './itemFilterWrapper.css';
import SearchInput, {createFilter} from 'react-search-input'
import Select from 'react-select';

class FilterPrice extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      priceFrom: props.priceFrom,
      priceTo: props.priceTo
    };

    this.onPriceToChangeHash = props.onPriceToChangeHash;
    this.onPriceFromChangeHash = props.onPriceFromChangeHash;

    this.onPriceFromChange = this.onPriceFromChange.bind(this);
    this.onPriceToChange = this.onPriceToChange.bind(this);
  }

  onPriceFromChange(event) {
    const value = event.target.value;
    this.onPriceFromChangeHash(value);
    this.setState({
      priceFrom: value
    });
  }

  onPriceToChange(event) {
    debugger;
    const value = event.target.value;
    this.onPriceToChangeHash(value);
    this.setState({
      priceTo: value
    });
  }

  render() {
    return(
      <div className="filter-price-wrapper">
        <input type="text" onChange={this.onPriceFromChange} className="filter-price-input" value={this.state.priceFrom} placeholder="From"/>
        <input type="text" onChange={this.onPriceToChange} className="filter-price-input" value={this.state.priceTo} placeholder="To"/>
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
      selectedBrandOptions: props.selectedBrandOptions,
      selectedStoreOptions: props.selectedStoreOptions,
      priceFrom: props.priceFrom ? props.priceFrom : '',
      priceTo: props.priceTo ? props.priceTo : ''
    };

    this.searchUpdated = this.searchUpdated.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.onPriceToChange = this.onPriceToChange.bind(this);
    this.onPriceFromChange = this.onPriceFromChange.bind(this);

    this.updateProductFunction = props.updateProductFunction;
    this.updateHashForPagination = props.updateHashForPagination;
    this.changePagination = props.changePagination;
  }

  onPriceToChange(value) {
    this.updateHashForPagination(1, 20);
    this.changePagination(1, 20);
    let currentHash = window.location.hash;
    const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
    debugger;
    if (currentHash.indexOf('priceTo') !== -1) {
      let regex = isThereMoreThanOneParam ? /priceTo=.*?&/ : /priceTo=.*/;
      let newHash = currentHash.replace(regex, `priceTo=${value}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&priceTo=${value}&` : `priceTo=${value}&`;
    }

    this.updateProductFunction();
    this.setState({
      priceTo: value
    });
  }

  onPriceFromChange(value) {
    this.updateHashForPagination(1, 20);
    this.changePagination(1, 20);
    let currentHash = window.location.hash;
    const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
    if (currentHash.indexOf('priceFrom') !== -1) {
      let regex = isThereMoreThanOneParam ? /priceFrom=.*?&/ : /priceFrom=.*/;
      let newHash = currentHash.replace(regex, `priceFrom=${value}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&priceFrom=${value}&` : `priceFrom=${value}&`;
    }

    this.updateProductFunction();
    this.setState({
      priceFrom: value
    });
  }

  handleStoreChange(value) {
    this.updateHashForPagination(1, 20);
    this.changePagination(1, 20);
    let currentHash = window.location.hash;
    let storesString = '';
    value.map(storeObj => {
      storesString += storesString === '' ? storeObj.value : ',' + storeObj.value;
    });
    const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
    if (currentHash.indexOf('stores') !== -1) {
      let regex = isThereMoreThanOneParam ? /stores=.*?&/ : /stores=.*/;
      let newHash = currentHash.replace(regex, `stores=${storesString}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&stores=${storesString}&` : `stores=${storesString}&`;
    }

    this.updateProductFunction();
    this.setState({
      selectedStoreOptions: value
    });
  }

  handleBrandChange(value) {
    this.updateHashForPagination(1, 20);
    this.changePagination(1, 20);
    let currentHash = window.location.hash;
    let brandsString = '';
    value.map(brandObj => {
      brandsString += brandsString === '' ? brandObj.value : ',' + brandObj.value;
    });
    const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
    if (currentHash.indexOf('brands') !== -1) {
      let regex = isThereMoreThanOneParam ? /brands=.*?&/ : /brands=.*/;
      let newHash = currentHash.replace(regex, `brands=${brandsString}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&brands=${brandsString}&` : `brands=${brandsString}&`;
    }

    this.updateProductFunction();
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
        <FilterPrice
          onPriceFromChangeHash={this.onPriceFromChange}
          onPriceToChangeHash={this.onPriceToChange}
          priceFrom={this.state.priceFrom}
          priceTo={this.state.priceTo}/>
      </div>
    );
  }
}


export default ItemFilterWrapper;