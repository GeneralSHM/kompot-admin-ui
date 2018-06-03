import React, { Component } from 'react';
import './itemTableHeader.css';

class ItemTableHeader extends Component {
  render() {

    return (
      <div className="item-table-header">
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Name</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Price</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Our Price</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Availability</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Store</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Brand</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Last Change</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>Product ID</span>
        </div>
        <div className="rTableCell">
          <span style={{fontWeight: 'bold'}}>API</span>
        </div>
      </div>
    );
  }
}

export default ItemTableHeader;