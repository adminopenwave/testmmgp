import React, { Component } from 'react';
import { connect } from "react-redux";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
class Actions extends Component {
  constructor(props) {
    super(props);
    let search = this.props.location.search;
    let params = new URLSearchParams(search);
    let action = params.get('action');
    let referenceno = params.get('referenceno');
    this.state = {
      action: action,
      Referenceno: referenceno,
    };
  }

  componentDidMount() {
    if(this.state.action === "approve"){
      this.approverRequest();
    }else if(this.state.action === "reject"){
      this.rejectRequest();
    }
  }

  approverRequest = () =>{
    let postData = { 
      UserId: this.props.UserId,
      ReferenceNo: this.state.Referenceno,
      WFStatus: "Approved",
      Remarks: ""
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/ApproveRejectGGP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.getToken,
    },
    body: JSON.stringify(postData)
    }).then(response=>{
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
          this.props.dispatch({ type: 'Token', value: "" });
          this.props.dispatch({ type: 'profile', value: "" });
          this.props.dispatch({ type: 'userType', value: "" });
      }
    })
    .then(data => {
      if(data){
        toast.success("Request approved successfully.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.props.history.push({ pathname: "/mytask/approved/list" });
      }
    })
  }

  rejectRequest = () =>{
    let postData = { 
      UserId: this.props.UserId,
      ReferenceNo: this.state.Referenceno,
      WFStatus: "Rejected",
      Remarks: ""
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/ApproveRejectGGP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.props.getToken,
    },
    body: JSON.stringify(postData)
    }).then(response=>{
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
          this.props.dispatch({ type: 'Token', value: "" });
          this.props.dispatch({ type: 'profile', value: "" });
          this.props.dispatch({ type: 'userType', value: "" });
      }
    })
    .then(data => {
      if(data){
        toast.success("Request rejected successfully.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.props.history.push({ pathname: "/mytask/rejected/list" });
      }
    })
  }

  render() {
    return (
       <>
       </>
    );
  }
}

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

export default connect(mapStateToProps)(Actions);