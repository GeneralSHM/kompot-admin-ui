import React, { Component } from 'react';
import ItemRow from './item-row/ItemRow';
import ItemTableHeader from './item-table-header/itemTableHeader';
import './itemTable.css';

class ItemTable extends Component {
  render() {
    const rows = [];
    for (let x = 0; x < 20; x ++) {
      rows.push(<ItemRow key={x}/>)
    }

    return (
      <div className="itemTable">
        <ItemTableHeader/>
        {rows}
      </div>
    );
  }
}

export default ItemTable;