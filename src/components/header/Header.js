import React, { Component } from 'react';
import './header.css';
import logo from '../../logo.png';

class Header extends Component {
    render() {
        return (
            <div className="header">
                <nav>
                    <div className="nav-wrapper">
                        <a href="/" className="brand-logo"><i className="material-icons">queue_music</i><span>ComPot</span></a><img src={logo} className="App-logo" alt="logo" />
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li className="nav-wrapper-list-item"><a target="_blank"><i className="material-icons left">library_add</i><span>Export csv</span></a></li>
                            <li className="nav-wrapper-list-item"><a className="add-brand"><i className="material-icons left">note_add</i><span>Add brand</span></a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Header;