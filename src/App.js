import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import ItemTable from './components/item-table/ItemTable';
import ItemListTable from './components/item-list-table/itemListTable';
import products from './products';
import ItemFilterWrapper from './components/item-filter-wrapper/itemFilterWrapper';

import Select from 'rc-select';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import 'rc-select/assets/index.css';
import locale_us from 'rc-pagination/lib/locale/en_US';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pageSize: 20,
      products: products,
      brands: [
        {value: 1, label: 'Hands'},
        {value: 2, label: 'Legs'},
        {value: 3, label: 'This is hell`a long brand name.'}
      ],
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
    const refreshView = this.state.refreshView;
    this.setState({
      pageSize,
      currentPage: 1,
      refreshView: !refreshView
    });
  }

  onPaginationChange(current, pageSize){
    const refreshView = this.state.refreshView;
    this.setState({
      currentPage: current,
      refreshView: !refreshView
    });
  }

  render() {
    const { products, pageSize, currentPage } = this.state;

    const productsForView = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
      <div className="App">
        <Header/>
        <ItemFilterWrapper brands={this.state.brands} stores={this.state.stores}/>
        <div style={{padding: '10px'}}>
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
            total={this.state.products.length}
          />
          <ItemListTable key={this.state.refreshView + 1} brands={this.state.brands} products={productsForView} />
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
            total={this.state.products.length}
          />
        </div>
      </div>
    );
  }
}

export default App;
