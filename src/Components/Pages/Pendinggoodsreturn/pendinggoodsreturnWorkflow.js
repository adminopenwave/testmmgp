import React, { Component } from 'react';
import { Breadcrumb } from "react-bootstrap";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import Moment from 'react-moment';

class pendinggoodsreturnWorkflow extends Component {
  constructor(props) {
    super(props);
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    var Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.state = {
        Referenceno: Referenceno,
        getApproverListArray: [],
        getWorkFlowListArray: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: "headerTitle", value: ((this.state.Referenceno) ? "Pending Goods Return : WorkFlow - " + this.state.Referenceno : "Pending Goods Return : WorkFlow")});
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    let bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    let Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.setState({ Referenceno: Referenceno }, ()=> this.getApproverList())
    this.getWorkFlowList()
  }

  getApproverList = () =>{
    let postData = { 
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetApprovers', {
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
      //console.log("getApproverList")
      //console.log(data)
      if(data){
        this.setState({ getApproverListArray: data.ApproversList})
      }
    })
  }

  getWorkFlowList = () =>{
    let postData = { 
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetWorkflowHistory', {
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
      //console.log("getApproverList")
      //console.log(data)
      if(data){
        this.setState({ getWorkFlowListArray: data.HistoryList})
      }
    })
  }

  render() {
     
    return (
       <>
        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/pendinggoodsreturn/list"}>Pending Goods Return</Breadcrumb.Item>
          <Breadcrumb.Item active>WorkFlow</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content-area"> 
            <section>
                <h2 className="form-heading"> Approver List </h2> 
                <div className="table-responsive custom-table-1"> 
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col"> Sequence No </th>
                    <th scope="col"> Approver </th>
                    <th scope="col"> Status </th>
                    <th scope="col"> Comments </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.getApproverListArray.map((loopdata, index) => (  
                        <tr>
                            <td> {index + 1} </td>
                            <td> {loopdata.Oriapproverid} / {loopdata.Oriapprovername} </td>
                            <td> <div className="badge badge-approver-pending">{loopdata.Wfstatus}</div> </td>
                            <td> {loopdata.Comments} </td>
                        </tr>
                    ))} 
                </tbody>
                </table>
                </div>
            </section>
            <section>
                <h2 className="form-heading"> Workflow History </h2> 
                <div className="table-responsive custom-table-1"> 
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col"> Date </th>
                    <th scope="col"> Workflow </th>
                    </tr>
                </thead>
                
                <tbody>
                    {this.state.getWorkFlowListArray.map((loopdata, index) => (  
                        <tr>
                            <td> <Moment format="DD-MM-YYYY hh:mm:ss A">{loopdata.Createddate}</Moment> </td>
                            <td> {loopdata.Description} </td>
                        </tr>
                    ))} 
                </tbody>
                </table>
                </div>
            </section>
        </div>
        <FloatingButton />
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

export default connect(mapStateToProps)(pendinggoodsreturnWorkflow);