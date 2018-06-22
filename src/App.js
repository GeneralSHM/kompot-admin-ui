import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import ItemTable from './components/item-table/ItemTable';
import ItemListTable from './components/item-list-table/itemListTable';
import products from './products';
import ItemFilterWrapper from './components/item-filter-wrapper/itemFilterWrapper';
import API from './Api';

import Select from 'rc-select';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import 'rc-select/assets/index.css';
import locale_us from 'rc-pagination/lib/locale/en_US';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this._getProductsApiString = this._getProductsApiString.bind(this);
    let currentHash = window.location.hash;

    let pageSize = 20;
    let currentPage = 1;
    let paramsFromHash = [];
    if (currentHash !== '') {
      paramsFromHash = this.getHashedPagination();
      paramsFromHash.map((paramObj) => {
        if (paramObj.key === 'page') {
          currentPage = parseInt(paramObj.value);
        } else if (paramObj.key === 'pageSize') {
          pageSize = parseInt(paramObj.value);
        }
      });
    } else {
      this._setHashForPagination(currentPage, pageSize);
    }
    const limit = pageSize;
    const offset = (currentPage - 1) * pageSize;

    const productsApiString = this._getProductsApiString();
    Promise.all([
      API.get(productsApiString),
      API.get(`brands`),
      API.get(`stores`)
    ]).then((response) => {
      const refreshView = this.state.refreshView;
      this.setState({
        products: response[0].data.data.items,
        brands: response[1].data.data,
        refreshView: !refreshView,
        totalProducts: response[0].data.data.pagination.totalCount,
        stores: response[2].data.data
      });
    });

    const searchTerm = paramsFromHash.filter(obj => obj.key === 'search');
    this.state = {
      pageSize: pageSize,
      products: [],
      brands: [],
      totalPages: 1,
      searchTerm: searchTerm.length === 1 ? searchTerm[0].value : '',
      currentPage: currentPage,
      refreshView: 1
    };

    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.onDeleteProduct = this.onDeleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.setAllProductsSendToAmazon = this.setAllProductsSendToAmazon.bind(this);
    this.addHashForThePagination = this.addHashForThePagination.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.changePagination = this.changePagination.bind(this);
  }

  onShowSizeChange(current, pageSize) {
    this.setState({
      pageSize,
      currentPage: 1,
    }, this.addHashForThePagination(1, pageSize));
  }

  _getProductsApiString() {
    const queryParams = this.getHashedPagination();
    let apiString = `products?`;
    let currentPage = 0;
    let pageSize = 0;
    queryParams.map((paramObj) => {
      if (paramObj.key === 'page') {
        currentPage = paramObj.value;
      } else if (paramObj.key === 'pageSize') {
        pageSize = paramObj.value;
      } else {
        apiString += paramObj.key + '=' + paramObj.value + '&';
      }
    });
    const limit = pageSize;
    const offset = (currentPage - 1) * pageSize;

    return `${apiString}&limit=${limit}&offset=${offset}`;
  }

  getProducts() {
    const apiString = this._getProductsApiString();
    const refreshView = this.state.refreshView;

    API.get(apiString).then(res => {
      this.setState({
        products: res.data.data.items,
        refreshView: refreshView + 1,
        totalProducts: res.data.data.pagination.totalCount
      });
    });
  }

  updateProduct(product) {
    API.put(`product/${product.id}`, { product }).then(res => {
      this.getProducts(this.state.currentPage, this.state.pageSize);
    });
  }

  deleteProduct(id) {
    API.delete(`product/${id}`).then(res => {
      this.getProducts(this.state.currentPage, this.state.pageSize);
    });
  }

  _setHashForPagination(current, pageSize) {
    let currentHash = window.location.hash;
    const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
    if (currentHash.indexOf('page') !== -1) {
      let regex = isThereMoreThanOneParam ? /page=.*?&/ : /page=.*/;
      let newHash = currentHash.replace(regex, `page=${current}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&page=${current}&` : `page=${current}&`;
    }
    currentHash = window.location.hash;
    if (currentHash.indexOf('pageSize') !== -1) {
      let regex = isThereMoreThanOneParam ? /pageSize=.*?&/ : /pageSize=.*/;
      let newHash = currentHash.replace(regex, `pageSize=${pageSize}&`);
      window.location.hash = newHash;
    } else {
      window.location.hash += isThereMoreThanOneParam ? `&pageSize=${pageSize}&` : `pageSize=${pageSize}&`;
    }
  }

  addHashForThePagination(current, pageSize) {
    this._setHashForPagination(current, pageSize);
    this.getProducts();
  }

  getHashedPagination() {
    let currentHash = window.location.hash;
    let params = [];
    if (currentHash === '') {
      return params;
    } else {
      currentHash = currentHash.substr(1);
    }
    currentHash.split('&').map((keyValueString) => {
      if(keyValueString.indexOf('=') !== -1){
        let pairArr = keyValueString.split('=');
        params.push({
          key: pairArr[0],
          value: pairArr[1]
        });
      }
    });

    return params;
  }

  changePagination(current, pageSize) {
    this.setState({
      currentPage: current,
      pageSize: pageSize
    });
  }

  onPaginationChange(current, pageSize){
    this.setState({
      currentPage: current,
    }, this.addHashForThePagination(current, pageSize));
  }

  onDeleteProduct(id) {
    this.deleteProduct(id);
  }

  setAllProductsSendToAmazon(dummyProduct) {
    const products = this.state.products;
    let promises = [];
    products.map((product) => {
      product.send_to_amazon = dummyProduct.send_to_amazon;
      promises.push(API.put(`product/${product.id}`, { product }));
    });

    Promise.all(promises).then(() => {
      this.getProducts(this.state.currentPage, this.state.pageSize);
    });
  }

  render() {
    const { products, pageSize, currentPage } = this.state;

    return (
        <div className="App">
          <Header/>
          {this.state.brands && this.state.stores &&
          <ItemFilterWrapper
            brands={this.state.brands}
            searchTerm={this.state.searchTerm}
            stores={this.state.stores}
            updateProductFunction={this.getProducts}
            updateHashForPagination={this._setHashForPagination}
            changePagination={this.changePagination}/>
          }
          {this.state.products && <div style={{padding: '10px'}}>
            <Pagination
              current={this.state.currentPage}
              onChange={this.onPaginationChange}
              selectComponentClass={Select}
              showSizeChanger
              locale={locale_us}
              pageSize={this.state.pageSize}
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              key={this.state.refreshView}
              total={this.state.totalProducts}
            />
            <ItemListTable
              key={this.state.refreshView + 3}
              brands={this.state.brands}
              products={products}
              updateProductToAPI={this.updateProduct}
              deleteProductToAPI={this.deleteProduct}
              onDeleteProduct={this.onDeleteProduct}
              setAllProductsSendToAmazon={this.setAllProductsSendToAmazon}
            />
            <Pagination
              current={this.state.currentPage}
              onChange={this.onPaginationChange}
              selectComponentClass={Select}
              showSizeChanger
              locale={locale_us}
              pageSize={this.state.pageSize}
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              key={this.state.refreshView + 2}
              total={this.state.totalProducts}
            />
          </div>}
        </div>);
  }
}

export default App;
