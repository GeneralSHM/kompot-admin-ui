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

    Promise.all([
      API.get(`products?limit=20&offset=0`),
      API.get(`brands`),
      API.get(`stores`)
    ]).then((response) => {
      const refreshView = this.state.refreshView;
      const pageSize = this.state.pageSize;
      this.setState({
        products: response[0].data.data.items,
        brands: response[1].data.data,
        refreshView: !refreshView,
        totalProducts: response[0].data.data.pagination.totalCount,
        stores: response[2].data.data
      });
    });

    this.state = {
      pageSize: 20,
      products: [],
      brands: [],
      totalPages: 1,
      currentPage: 1,
      refreshView: 1
    };

    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.onDeleteProduct = this.onDeleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.setAllProductsSendToAmazon = this.setAllProductsSendToAmazon.bind(this);
  }

  onShowSizeChange(current, pageSize) {
    this.getProducts(1, pageSize);
    this.setState({
      pageSize,
      currentPage: 1,
    });
  }

  getProducts(currentPage, pageSize) {
    const limit = pageSize;
    const offset = (currentPage - 1) * pageSize;
    const refreshView = this.state.refreshView;
    API.get(`products?limit=${limit}&offset=${offset}`).then(res => {
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

  onPaginationChange(current, pageSize){
    this.getProducts(current, pageSize);
    this.setState({
      currentPage: current,
    }, () => {
      const currentHash = window.location.hash;
      const isThereMoreThanOneParam = currentHash.indexOf('&') !== -1;
      if (currentHash.indexOf('page') !== -1) {
        let regex = isThereMoreThanOneParam ? /page=.*?&/ : /page=.*/;
        let newHash = currentHash.replace(regex, `page=${current}&`);
        window.location.hash = newHash;
      } else {
        window.location.hash += isThereMoreThanOneParam ? `&page=${current}` : `page=${current}`;
      }
    });
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
          <ItemFilterWrapper key={this.state.refreshView + 1} brands={this.state.brands} stores={this.state.stores}/>
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
