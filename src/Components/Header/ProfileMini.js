import React, { Component } from 'react';
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class ProfileMini extends Component {

  logout = () => {
    this.props.dispatch({ type: 'Referenceno', value: "" });
    this.props.dispatch({ type: 'UserId', value: "" });
    this.props.dispatch({ type: 'profile', value: "" });
    this.props.dispatch({ type: 'headerTitle', value: "" });
    this.props.dispatch({ type: 'Token', value: "" });
    this.props.dispatch({ type: 'userType', value: "" });
    this.props.dispatch({ type: 'userName', value: "" });
  }

  render() {
    return (
        <>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar-nav ml-auto">
            <NavDropdown title={
                <button id="navbardrop" className="button-link">
                <span className="d-inline-block"> {this.props.userName} <span className="f-s-12 f-w-300"> ({this.props.userType}) </span> </span>
                </button>
            } id="basic-nav-dropdown">
                <NavDropdown.Item href="#" className="dropdown-item">About me</NavDropdown.Item>
                <NavDropdown.Item href="/changeuser" className="dropdown-item" onClick={this.logout} >Sign in as different user</NavDropdown.Item>
                <NavDropdown.Item href="#" className="dropdown-item" onClick={this.logout}>Logout</NavDropdown.Item>
            </NavDropdown>
            </Nav>
        </Navbar.Collapse>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    menuVisibility: state.menuVisibility,
    menuStatusHeader: state.menuStatusHeader,
    getToken: state.token,
    userType: state.userType,
    userName: state.userName,
    UserId: state.UserId,
  };
}

export default connect(mapStateToProps)(ProfileMini);