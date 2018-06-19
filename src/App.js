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
      API.get(`brands`)
    ]).then((response) => {
      const refreshView = this.state.refreshView;
      const pageSize = this.state.pageSize;
      this.setState({
        products: response[0].data.data.items,
        brands: response[1].data.data,
        refreshView: !refreshView,
        totalProducts: response[0].data.data.pagination.totalCount
      });
    });

    this.state = {
      pageSize: 20,
      products: [],
      brands: [],
      totalPages: 1,
      stores: [
        {value: 'https://www.google.com', label: 'google'},
        {value: 'https://www.github.com', label: 'githib'}
      ],
      currentPage: 1,
      refreshView: true
    };

    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onPaginationChange = this.onPaginationChange.bind(this);
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
        refreshView: !refreshView,
        totalProducts: res.data.data.pagination.totalCount
      });
    });
  }

  updateProduct(product) {
    API.put(`product/${product.id}`, { product }, res => {});
  }

  onPaginationChange(current, pageSize){
    this.getProducts(current, pageSize);
    this.setState({
      currentPage: current,
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
            <ItemListTable key={this.state.refreshView + 1}
                           brands={this.state.brands}
                           products={products}
                           updateProductToAPI={this.updateProduct}
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
