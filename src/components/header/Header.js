import React, { Component } from 'react';
import './header.css';
import logo from '../../logo.png';
import Modal from 'react-responsive-modal';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            openModal: false,
            brandName: ''
        };
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onChangeBrandName = this.onChangeBrandName.bind(this);
        this.createBrand = this.createBrand.bind(this);
        this.createBrandFunction = props.createBrandFunction;
    }

    createBrand() {
        this.createBrandFunction(this.state.brandName);
    }

    onChangeBrandName(event) {
        this.setState({
          brandName: event.target.value
        });
    }

    onOpenModal() {
      this.setState({ openModal: true });
    }

    onCloseModal() {
      this.setState({ openModal: false });
    }

    render() {
        return (
            <div className="header">
                <Modal
                  open={this.state.openModal}
                  onClose={this.onCloseModal}
                  showCloseIcon={false}
                  center>
                    <div className="form-style-6">
                        <h1>Add new brand</h1>
                        <form>
                            <input type="text" name="field1" onChange={this.onChangeBrandName} placeholder="Brand Name" />
                            <input type="button" onClick={this.createBrand} value="Create" />
                        </form>
                    </div>
                </Modal>
                <nav>
                    <div className="nav-wrapper">
                        <a href="/" className="brand-logo"><i className="material-icons">queue_music</i><span>ComPot</span></a><img src={logo} className="App-logo" alt="logo" />
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li className="nav-wrapper-list-item"><a style={{color: 'white'}} target="_blank" href="http://212.237.24.65/kompot-admin-api/src/public/export"><i className="material-icons left">library_add</i><span>Export csv</span></a></li>
                            <li className="nav-wrapper-list-item"><a className="add-brand"><i className="material-icons left">note_add</i><span onClick={this.onOpenModal}>Add brand</span></a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Header;