import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { connect } from "react-redux";

class Logo extends Component{
  
  render(){
    // alert(this.props.headerTitle)
    if(this.props.menuStatusHeader === 'active'){
      return (
        <>
          <Navbar.Brand href="/" className="navbar-brand">
          <img src={process.env.REACT_APP_ENV +"/assets/images/logo/logo.png"} width="65" alt="Logo" />
          </Navbar.Brand>
          <Navbar.Brand id="menu-action" className="d-sm-block" onMouseEnter={this.props.openMenu} onMouseLeave={this.props.closeMenu} onClick={this.props.MenuStatusClose}><i className="fa fa-close"></i></Navbar.Brand>
          <div className="header-title d-none d-sm-block">{this.props.headerTitle}</div>
        </>
      );
    }else{
    return (
      <>
        <Navbar.Brand href="/" className="navbar-brand">
        <img src={process.env.REACT_APP_ENV +"/assets/images/logo/logo.png"} width="65" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Brand id="menu-action" className="d-sm-block" onMouseEnter={this.props.openMenu} onMouseLeave={this.props.closeMenu} onClick={this.props.MenuStatusOpen}><i className="fa fa-bars"></i></Navbar.Brand>
        <div className="header-title d-none d-sm-block">{this.props.headerTitle}</div>
      </>
    );
    }
  }
};


const mapStateToProps = state => {
  return {
    menuVisibility: state.menuVisibility,
    menuStatusHeader: state.menuStatusHeader,
    headerTitle: state.headerTitle,
    getToken: state.token,
    userType: state.userType,
    userName: state.userName,
    UserId: state.UserId,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    openMenu: () => dispatch({type:'openMenu'}),
    closeMenu: () => dispatch({type:'closeMenu'}),
    MenuStatusOpen: () => dispatch({type:'MenuStatusOpen'}),
    MenuStatusClose: () => dispatch({type:'MenuStatusClose'}),
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Logo);