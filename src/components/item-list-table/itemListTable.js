import React, { Component } from 'react';
import './itemListTable.css';
import Select from 'react-select';
import "react-toggle/style.css";
import Toggle from 'react-toggle';
import Modal from 'react-responsive-modal';

const TableHead = (props) => {
  return (<div className="table-head"><span>{props.name}</span></div>);
};

class Row extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    return(<div className="row">{this.props.cells}</div>);
  }
}

const Cell = (props) => {
  return (<div className="table-cell">{props.data}</div>);
};

class SelectBrand extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedOption: props.brand || '',
      product: props.product
    };

    this.handleBrandChange = props.handleBrandChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateProductToAPIFunction = props.updateProductToAPIFunction;
  }

  handleChange(brand) {
    if (brand === null) {
      brand = { value: 0 };
    }
    this.setState({
      selectedOption: brand.value
    });
    const product = this.state.product;
    product.brandId = brand.value;
    this.updateProductToAPIFunction(product);
    this.handleBrandChange(brand);
  }

  render() {
    return (<div className="select-brand"><Select
      name="form-brand-select"
      value={this.state.selectedOption}
      onChange={this.handleChange}
      options={this.props.brands}
    /></div>);
  }
}

const SimpleText = (props) => {
  return (<span>{props.name}</span>);
};

const ProductName = (props) => {
  return (<div className="test-wrap">{props.name}</div>);
};

const Price = (props) => {
  return (<span>{props.price}</span>);
};

const OurPrice = (props) => {
  let style = {};
  if (props.otherPrice != props.price) {
    style.color = 'red';
  }
  return (<span style={style}>{props.price}</span>);
};

const Availability = (props) => {
  const { availability } = props;
  const inStock = availability === 'Active';
  const className = inStock ? 'green-text' : 'red-text';
  const text = inStock ? 'Available': 'Not available';

  return (<span className={className}>{text}</span>);
};

class ActionsBar extends Component{
  constructor(props, context) {
    super(props, context);

    this.state = {
      product: props.product,
      openModal: false,
      openModalForDelete: false
    };

    this.onOpenModal = this.onOpenModal.bind(this);
    this.onOpenModalForDelete = this.onOpenModalForDelete.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onCloseModalDelete = this.onCloseModalDelete.bind(this);
    this.onSkuChange = this.onSkuChange.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.updateProductToAPIFunction = props.updateProductToAPIFunction;
  }

  updateProduct() {
    this.updateProductToAPIFunction(this.state.product);
    this.onCloseModal();
  }

  onSkuChange(event) {
    let product = this.state.product;
    product.sku = event.target.value;
    this.setState({
      product: product
    });
  }

  onPriceChange(event) {
    let product = this.state.product;
    product.our_price = event.target.value;
    this.setState({
      product: product
    });
  }

  onOpenModal() {
    this.setState({ openModal: true });
  }

  onCloseModal() {
    this.setState({ openModal: false });
  }

  onOpenModalForDelete() {
    this.setState({ openModalForDelete: true });
  }

  onCloseModalDelete() {
    this.setState({ openModalForDelete: false });
  }

  render() {
    const icons = [
      <img key={1} onClick={this.onOpenModal} className="action-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHISURBVGhD7dlJSsRwFMThBuf5EHoDD6QIXsG1J3DlBRzbeZ7nCVeuvIhH0F8hLSE8w0tn8f6BFHzQ9Kpq0XmQbjVp0qR2GcMy3jCjL+qYCbzjO2MBtYo1onZjikZ01GLMPKzyebUYswirfF5yY3ow9fvxL94xs0giGrGCL0zri0w8Y54QHo1YRadUN2OWEBqNWEe+WJkxerqNIywasQmrnHjGaIQe1WHRiC1kS1mKxoSP6MUO8qX/Y42ZQ+iIPuzCKlzEGhOWfuzBKuqhMZMITdURojuj31ZYNOIAVjmvNYSPOIJVzmsD4SNOYJXzaiN8xBmscl7bCB0xgAtY5bx0Z0JHDOISVjkv3RkdzbBoxBWscl56ROtohmUIVUfsQ7+tsAzjGlY5r0OEj7iFVc7rGOEj7mGV8zpF+IhHWOW8zhE6YgTPsMp56c6Ej3iBVc5Ld0ZHMyyjqDpCj2jdm7Do1f4rrHJeekTr3oRFr1r034RVzusGekCERo9Iq5xXEiOUT1gFPe6QxAil2yEPSGaE0s0QvVROaoRSdoiOZXIjlDJDdGd0NJOMd4jujI5msvEM0Z3R0Uw6emv+UUDvrUL/n2jSpEnZtFo/7yot3NO64EMAAAAASUVORK5CYII=" />,
      <img key={2} onClick={this.onOpenModalForDelete} className="action-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEjSURBVGhD7Zk9agJRFIVnB1bBbWgR12FrbZAUgq21ja7AXkvLtJaWCWQBWYZ2gSTnwBMuj4fj6H0zYTwffM3lvJ8DU70phBDi4XmF+xKZ+ddM4Q/8LZEZZhvhBe4u+AavKXGWWa5J7XWWZ7qzhqkL5ZRnuqMid5ilyBCuapZnijJ6cJLZAczOHKa+Z0+XMDsqUkEVqULrixzhh/ETxhnObIZr4gxttMgBWjowznBm4Zo4Q1WkCioSZhYV8UBFwsyiIh6oSJhZVMQDFQkzi4p4oCJhZlERD1pf5AvaR7YZjDOc2QzXxBnaaBFPW1NkAbPDv0ipwz0dw+x04QmmLuAhn4ieYC2M4DdMXeQeuSf3rpVnuIXv0D663SL32MA+FEK4UxR/dgb0zufBmgUAAAAASUVORK5CYII=" alt=""/>
    ];

    return (
      <div>
        <Modal
          open={this.state.openModal}
          onClose={this.onCloseModal}
          showCloseIcon={false}
          center>
          <div className="form-style-6">
            <h1>Update product</h1>
            <form>
              <input type="text" name="field1" value={this.state.product.sku} onChange={this.onSkuChange} placeholder="Amazon sku" />
              <input type="text" name="field2" value={this.state.product.our_price} onChange={this.onPriceChange} placeholder="Amazon Price" />
              <input type="button" onClick={this.updateProduct} value="Update" />
            </form>
          </div>
        </Modal>
        <Modal
          open={this.state.openModalForDelete}
          onClose={this.onCloseModalDelete}
          showCloseIcon={false}
          center>
          <div className="form-style-6">
            <h1 style={{padding: "10px"}}>Are you sure you want to delete this product</h1>
            <form>
              <input type="button" value="Delete" />
            </form>
          </div>
        </Modal>
        {icons}
      </div>
    );
  }
};

class StoreSelect extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      stores: props.stores,
      selectedOption: ''
    };

    this.handleStoreSelect = this.handleStoreSelect.bind(this);
  }

  handleStoreSelect(store) {
    if (store) {
      let win = window.open(store.value, '_blank');
      win.focus();
    }
  }

  render() {
    return(<div className="select-store"><Select
      name="form-store-select"
      value={this.state.selectedOption}
      onChange={this.handleStoreSelect}
      options={this.state.stores}
    /></div>);
  }
};

class ApiCheckbox extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      productId: props.productId,
      checked: props.sendToAmazon
    };

    this.handleBaconChange = this.handleBaconChange.bind(this);
  }

  handleBaconChange(event) {
    const checked = event.target.value === true;

    this.setState({
      checked: checked
    });

    //TODO send to API
  }

  render() {
    return (<label>
      <Toggle
        defaultChecked={this.state.checked}
        onChange={this.handleBaconChange} />
    </label>);
  }

}

class ItemListTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      brands: props.brands,
      products: props.products,
      updateProductToAPIFunction: props.updateProductToAPI
    };
  };

  onChangeBrand(brand) {
    this.setState({
      brandSelected: brand.value
    });
  }


  render() {
    const headerCellsNames = [
      'Name',
      'Price',
      'Our Price',
      'Availability',
      'Store',
      'Brand',
      'Last change',
      'Product ID',
      'API',
      'Actions'
    ];

    const headerCells = [];
    for (let key in headerCellsNames) {
      headerCells.push(<TableHead key={key} name={headerCellsNames[key]}/>);
    }

    const products = this.state.products;
    const rows = [];
    for (let x = 0; x < products.length; x ++) {
      let rowData = [];
      rowData.push(<Cell key={x} data={<ProductName name={products[x].name}/>}/>);
      rowData.push(<Cell key={(x + 1)} data={<Price price={products[x].price}/>}/>);
      rowData.push(<Cell key={(x + 2)} data={<OurPrice otherPrice={products[x].price} price={products[x].our_price}/>}/>);
      rowData.push(<Cell key={(x + 3)} data={<Availability availability={products[x].availability}/>}/>);
      rowData.push(<Cell key={(x + 4)} data={<StoreSelect stores={products[x].stores}/>}/>);
      rowData.push(<Cell key={(x + 5)} data={<SelectBrand handleBrandChange={this.onChangeBrand} updateProductToAPIFunction={this.state.updateProductToAPIFunction} brand={products[x].brandId} product={products[x]} brands={this.state.brands}/>}/>);
      rowData.push(<Cell key={(x + 6)} data={<SimpleText name={products[x].last_change}/>}/>);
      rowData.push(<Cell key={(x + 7)} data={<SimpleText name={products[x].product_id}/>}/>);
      rowData.push(<Cell key={(x + 8)} data={<ApiCheckbox productId={1} sendToAmazon={products[x].send_to_amazon}/>}/>);
      rowData.push(<Cell key={(x + 9)} data={<ActionsBar updateProductToAPIFunction={this.state.updateProductToAPIFunction} product={products[x]} />}/>);

      let row = <Row key={x} cells={rowData}/>;
      rows.push(row);
    }

    return (
      <div>
        <div className="table">
          <Row cells={headerCells}/>
          {rows}
        </div>
      </div>
    );
  }
}

export default ItemListTable;
