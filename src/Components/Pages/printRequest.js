import React, { Component } from 'react';
import { Breadcrumb } from "react-bootstrap";
import { connect } from "react-redux";
import Moment from 'react-moment';
import Spinner from 'react-bootstrap/Spinner';

class printRequest extends Component {
  constructor(props) {
    super(props);
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    var Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.state = {
        Referenceno: Referenceno,
        StatffInfo_StaffName: "",
        StatffInfo_Section: "",
        StatffInfo_Department: "",
        StatffInfo_Division: "",
        StatffInfo_Designation: "",
        GGPDescription_GGPReferenceNo: "",
        GGPDescription_GGPDescription: "",
        AuthorizedCarrier_AuthorizedCategory: "",
        AuthorizedCarrier_AuthorizedName: "",
        AuthorizedCarrier_ICNumber: "",
        AuthorizedCarrier_AuthorizedCompany: "",
        AuthorizedCarrier_CompanyAddress: "",
        AuthorizedCarrier_VehicleNumber: "",
        GoodsCategory_GoodsCategory: "",
        GoodsCategory_PurposeofExit: "",
        GoodsCategory_Exitpurposeremarks: "",
        GoodsCategory_TargetdateofReturn: "",
        GoodsCategory_TypeofGoods: "",
        GoodsCategory_Statusofgoods: "",
        GoodsCategory_Goodsstatusremarks: "",
        GoodsCategory_Destinationofgoods: "",
        GoodsCategory_GoodsExittime: "",
        GoodsCategory_Goodsexittimeremarks: "",
        GoodsCategory_CompanyNameAddress: "",
        GoodsItem: [],
        Attachments: [],
        References: [],
        HistoryList: [],
        getApproverListArray: [],
        loading: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: "Yes" })
    this.props.dispatch({ type: 'headerTitle', value: "Approved : View" })
    this.getGGPRequest();
    this.getApproverList();
  }

  getApproverList = () =>{
    let postData = { 
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertWorkFlow', {
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
        console.log(data)
      if(data){
        this.setState({ getApproverListArray: data.ApproversList})
      }
    })
  }

  getGGPRequest = () =>{
    let postData = { Referenceno: this.state.Referenceno }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetGGPDetails', {
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
        console.log(data)
        if(data){
            if(data.StatffInfo){
                this.setState({
                    StatffInfo_Section: data.StatffInfo.Section,
                    StatffInfo_Department: data.StatffInfo.Department,
                    StatffInfo_Division: data.StatffInfo.Division,
                    StatffInfo_Designation: data.StatffInfo.Designation,
                })
                if(data.StatffInfo.EmployeeId){
                    this.setState({ 
                        StatffInfo_StaffName: data.StatffInfo.EmployeeId +" / "+data.StatffInfo.Name,
                    })
                }
            }
            if(data.GGPDetails){
                this.setState({ 
                    GGPDescription_GGPReferenceNo: data.GGPDetails.Referenceno,
                    GGPDescription_GGPDescription: data.GGPDetails.Description,
                    AuthorizedCarrier_AuthorizedCategory: data.GGPDetails.Authorizedcategory,
                    AuthorizedCarrier_ICNumber: data.GGPDetails.Icnumber,
                    AuthorizedCarrier_AuthorizedCompany: data.GGPDetails.Authorizedcompany,
                    AuthorizedCarrier_CompanyAddress: data.GGPDetails.Authorizedcompanyaddress,
                    AuthorizedCarrier_VehicleNumber: data.GGPDetails.Vehiclenumber,
                    GoodsCategory_GoodsCategory: data.GGPDetails.Goodscategory,
                    GoodsCategory_PurposeofExit: data.GGPDetails.Exitpurpose,
                    GoodsCategory_Exitpurposeremarks: data.GGPDetails.Exitpurposeremarks,
                    GoodsCategory_TargetdateofReturn: data.GGPDetails.Returndate,
                    GoodsCategory_TypeofGoods: data.GGPDetails.Goodstype,
                    GoodsCategory_Statusofgoods: data.GGPDetails.Goodsstatus,
                    GoodsCategory_Goodsstatusremarks: data.GGPDetails.Goodsstatusremarks,
                    GoodsCategory_Destinationofgoods: data.GGPDetails.Goodsdestination,
                    GoodsCategory_GoodsExittime: data.GGPDetails.Goodsexittime,
                    GoodsCategory_Goodsexittimeremarks: data.GGPDetails.Goodsexittimeremarks,
                    GoodsCategory_CompanyNameAddress: data.GGPDetails.Goodscompanyaddress,
                })
                if(data.GGPDetails.Authorizedcategory !== "MMHE Staff"){
                    this.setState({ 
                        AuthorizedCarrier_AuthorizedName: data.GGPDetails.Authorizedname,
                    })
                }else{
                    if(data.GGPDetails.Authorizedid){
                        this.setState({ 
                            AuthorizedCarrier_AuthorizedName: data.GGPDetails.Authorizedid +" / "+data.GGPDetails.Authorizedname,
                        })
                    }
                }
            }

            if(data.GGPGoodsItemsList){
                this.setState({ 
                    GoodsItem: data.GGPGoodsItemsList,
                })
            }
            if(data.AttachmentsList){
                this.setState({ 
                    Attachments: data.AttachmentsList,
                })
            }
            if(data.ReferenceLinkList){
                this.setState({ 
                    References: data.ReferenceLinkList,
                })
            }
            if(data.HistoryList){
                this.setState({ 
                    HistoryList: data.HistoryList,
                })
            }
            this.setState({ loading: "" })
        }
    })
  }

  viewGGPForm = () =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/approved/viewggpform?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(this.state.Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  printOrder = () => {
    window.print();
  }
cancelPrint = () =>{
    this.props.history.push({ pathname: "/approved/list" });
}

  render() {
    if(this.state.loading){
        return (
            <>
            <div className="content-area"> 
                <section>
                    <div style={{margin: "auto", width: "0%" }} >
                        <Spinner animation="border" variant="primary" />
                    </div>
                </section>
            </div>
            </>
        )
    }else{
        return (
        <>
            
            <div className="content-area"> 
                <section>
                <h2 className="form-heading">Requester Information</h2>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Staff No / Name </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_StaffName} </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Section</label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Section}  </b> </p>
                    </div>
                    </div>;
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Department </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Department}  </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Division </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Division} </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Designation </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Designation} </b> </p>
                    </div>
                    </div>
                </div>
                </section>
                <section>
                <h2 className="form-heading">Requisition Details </h2>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> GGP Reference No </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.GGPDescription_GGPReferenceNo} </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Group </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  Finance  </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Request Type </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  Goods Gate Pass </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Description</label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.GGPDescription_GGPDescription} </b> </p>
                    </div>
                    </div>
                </div>
                </section>
                <section>
                    <h2 className="form-heading"> Workflow </h2> 
                    <div className="table-responsive custom-table-1"> 
                    <table className="table">
                    <thead>
                        <tr>
                        <th scope="col"> Date </th>
                        <th scope="col"> Workflow </th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.HistoryList.map((loopdata, index) => (  
                    <tr>
                            <td> <Moment format="DD-MM-YYYY hh:mm:ss A">{loopdata.Createddate}</Moment> </td>
                            <td> {loopdata.Description} </td>
                        </tr>
                    ))}
                </tbody>
                    </table>
                    </div>
                </section>
                <section>
                    <h2 className="form-heading"> Approver Comments </h2> 
                    <div className="table-responsive custom-table-1"> 
                    <table className="table">
                    <thead>
                        <tr>
                        <th scope="col"> Approver </th>
                        <th scope="col"> Comments </th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.getApproverListArray.map((loopdata, index) => (  
                    <tr>
                            <td> {loopdata.Oriapproverid}/{loopdata.Oriapprovername} </td>
                            <td> {loopdata.Comments} </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
                </section>
                <div className="clearfix text-right standard-print">
                    <button type="button" className="btn btn-cancel" data-dismiss="modal" onClick={() => this.cancelPrint()}>Cancel </button>
                    <button type="button" className="btn btn-primary" onClick={() => this.printOrder()}> Print </button>
                </div>
            </div>
        </>
        );
    }
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

export default connect(mapStateToProps)(printRequest);