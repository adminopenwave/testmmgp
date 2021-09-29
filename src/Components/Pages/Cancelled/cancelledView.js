import React, { Component } from 'react';
import { Breadcrumb } from "react-bootstrap";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import Moment from 'react-moment';
import Spinner from 'react-bootstrap/Spinner';

class cancelledView extends Component {
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
        loading: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: "Yes" })
    this.props.dispatch({ type: 'headerTitle', value: "Cancelled : View" })
    this.getGGPRequest();
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
        //console.log(data)
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
            this.setState({ loading: "" })
        }
    })
  }

  render() {
    if(this.state.loading){
        return (
            <>
             <Breadcrumb>
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/cancelled/list"}>My Application : Cancelled List</Breadcrumb.Item>
            <Breadcrumb.Item active>View</Breadcrumb.Item>
            </Breadcrumb>
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
            <Breadcrumb>
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/cancelled/list"}>My Application : Cancelled List</Breadcrumb.Item>
            <Breadcrumb.Item active>View</Breadcrumb.Item>
            </Breadcrumb>
            <div className="content-area"> 
                <section>
                <h2 className="form-heading">Requester Information - <span className="text-danger">Cancelled</span></h2> 
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
                <h2 className="form-heading"> GGP Description </h2>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> GGP Reference No </label>
                    <div className="col-sm-10">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.GGPDescription_GGPReferenceNo}  </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> GGP Description </label>
                    <div className="col-sm-10">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.GGPDescription_GGPDescription}  </b> </p>
                    </div>
                    </div>
                </div>
                </section>
                <section>
                <h2 className="form-heading"> Authorized Carrier </h2>
                <div className="form-group row mb-0">
                    <label for="auth-cat" className="col-sm-2 col-form-label">Authorized Category </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedCategory}  </b> </p>
                    </div>
                    </div>
                </div>
                {(() => {
                    if (this.state.AuthorizedCarrier_AuthorizedCategory === "MMHE Staff") {
                        return (
                            <>
                                <div className="form-group row mb-0">
                                    <label for="auth-name" className="col-sm-2 col-form-label">Authorized Name </label>
                                    <div className="col-sm-4">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedName} </b> </p>
                                    </div>
                                    </div>
                                </div>
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-2 col-form-label"> Vehicle Number </label>
                                    <div className="col-sm-4">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_VehicleNumber} </b> </p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </>
                        )
                    } else if (this.state.AuthorizedCarrier_AuthorizedCategory === "Supplier's Rep" || this.state.AuthorizedCarrier_AuthorizedCategory === "Subcontractor's Rep") {
                        return (
                            <>
                                <div className="form-group row mb-0">
                                    <label for="auth-name" className="col-sm-2 col-form-label">Authorized Name </label>
                                    <div className="col-sm-4">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedName} </b> </p>
                                    </div>
                                    </div>
                                </div>
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-2 col-form-label"> IC Number </label>
                                    <div className="col-sm-4">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_ICNumber}  </b> </p>
                                    </div>
                                    </div>
                                </div>
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-2 col-form-label"> Authorized Company </label>
                                    <div className="col-sm-4">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedCompany}  </b> </p>
                                    </div>
                                    </div>
                                </div>
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-2 col-form-label"> Company Address </label>
                                    <div className="col-sm-6">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_CompanyAddress} </b> </p>
                                    </div>
                                    </div>
                                </div>
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-2 col-form-label"> Vehicle Number </label>
                                    <div className="col-sm-4">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_VehicleNumber} </b> </p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </>
                        )
                    } else {
                        return (
                        <>
                            <div className="form-group row mb-0">
                                <label for="auth-name" className="col-sm-2 col-form-label">Authorized Name </label>
                                <div className="col-sm-4">
                                <div className="input-group mb-2 mr-sm-2">
                                    <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedName} </b> </p>
                                </div>
                                </div>
                            </div>
                            <div className="form-group row mb-0">
                                <label for="" className="col-sm-2 col-form-label"> IC Number </label>
                                <div className="col-sm-4">
                                <div className="input-group mb-2 mr-sm-2">
                                    <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_ICNumber}  </b> </p>
                                </div>
                                </div>
                            </div>
                            <div className="form-group row mb-0">
                                <label for="" className="col-sm-2 col-form-label"> Company Address </label>
                                <div className="col-sm-6">
                                <div className="input-group mb-2 mr-sm-2">
                                    <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_CompanyAddress} </b> </p>
                                </div>
                                </div>
                            </div>
                            <div className="form-group row mb-0">
                                <label for="" className="col-sm-2 col-form-label"> Vehicle Number </label>
                                <div className="col-sm-4">
                                <div className="input-group mb-2 mr-sm-2">
                                    <div className="input-group mb-2 mr-sm-2">
                                    <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_VehicleNumber} </b> </p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </>
                        )
                    }
                })()}
                </section>
                <section> 
                <h2 className="form-heading"> Goods Category</h2> 
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Goods Category  </label>
                    <div className="col-sm-6">
                    <div className="input-group mb-2 mr-sm-2">
                        <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_GoodsCategory} </b> </p>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="purpose-exit" className="col-sm-2 col-form-label"> Purpose of Exit </label>
                    <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                            <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_PurposeofExit}
                            </b> </p>
                        </div>
                    </div>
                </div>
                {(() => {
                if (this.state.GoodsCategory_PurposeofExit === "Others") {
                return (
                <>
                    <div className="form-group row mb-0">
                    <label for="purpose-exit" className="col-sm-2 col-form-label"> Purpose of Exit (Others) </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Exitpurposeremarks}
                        </b> </p>
                        </div>
                    </div>
                    </div>
                </>
                )
                }
                })()}
                {(() => {
                    if (this.state.GoodsCategory_GoodsCategory === "Returnable") {
                    return (
                    <div className="form-group row mb-0">
                        <label for="" className="col-sm-2 col-form-label"> Target Date of Return </label>
                        <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                            <p className="m-0 py-2"> 
                                <b> <span className="d-none d-sm-inline"> : </span> 
                                    <Moment format="DD-MM-YYYY">{this.state.GoodsCategory_TargetdateofReturn}</Moment>
                                </b> 
                            </p>
                        </div>
                        </div>
                    </div>
                    )
                    }
                })()}
                <div className="form-group row mb-0">
                    <label for="goods-type" className="col-sm-2 col-form-label"> Type of Goods </label>
                    <div className="col-sm-6">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_TypeofGoods} </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Status of Goods  </label>
                    <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Statusofgoods} </b> </p>
                    </div>
                    </div>
                </div>
                {(() => {
                    if (this.state.GoodsCategory_Statusofgoods === "Others") {
                    return (
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-2 col-form-label"> Status of Goods (Others)  </label>
                            <div className="col-sm-4">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Goodsstatusremarks} </b> </p>
                            </div>
                            </div>
                        </div>
                    )
                    }
                })()}
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Destination of Goods  </label>
                    <div className="col-sm-6">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Destinationofgoods} </b> </p>
                    </div>
                    </div>
                </div>
                <div className="form-group row mb-0">
                    <label for="goods-exit-time" className="col-sm-2 col-form-label">  Goods Exit Time </label>
                    <div className="col-sm-6">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_GoodsExittime} </b> </p>
                    </div>
                    </div>
                </div>
                {(() => {
                    if (this.state.GoodsCategory_GoodsExittime === "After Office Hour" || this.state.GoodsCategory_GoodsExittime === "Off Day / Public Holiday") {
                    return (
                    <div className="form-group row mb-0">
                        <label for="goods-exit-time" className="col-sm-2 col-form-label"> Goods Exit Time (Justification) </label>
                        <div className="col-sm-6">
                        <div className="input-group mb-2 mr-sm-2">
                            <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Goodsexittimeremarks} </b> </p>
                        </div>
                        </div>
                    </div>
                    )
                    }
                })()}
                <div className="form-group row mb-0">
                    <label for="" className="col-sm-2 col-form-label"> Company Name & Address </label>
                    <div className="col-sm-6">
                    <div className="input-group mb-2 mr-sm-2">
                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_CompanyNameAddress} </b> </p>
                    </div>
                    </div>
                </div>
                </section>
            <section>
                <h2 className="form-heading"> Goods Item </h2> 
                <table className="table table-bordered">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col"> Qty </th>
                    <th scope="col"> Serial No </th>
                    {/* {(() => {
                        if (this.state.GoodsCategory_GoodsCategory === "Returnable") {
                        return (
                         <th scope="col"> Qty to be Return </th>
                        )
                        }
                    })()} */}
                    <th scope="col"> Description  </th>
                    
                    </tr>
                </thead>
                <tbody>
                    {this.state.GoodsItem.map((loopdata, index) => (  
                        <tr>
                            <td>{index + 1}</td>
                            <td>{loopdata.Qtyunit}</td>
                            <td>{loopdata.Serialno}</td>
                            {/* {(() => {
                                if (this.state.GoodsCategory_GoodsCategory === "Returnable") {
                                return (
                                    <td>{loopdata.Qtyreturn}</td>
                                )
                                }
                            })()} */}
                            <td>{loopdata.Description}</td>
                        </tr>
                    ))}  
                </tbody>
                </table>
                {(() => {
                if (this.state.GoodsItem.length <= 0) {
                    return (
                    <div>
                        <p className="text-center">No record found.</p>                 
                    </div>
                    )
                }
                })()}
            </section>
            <section>
                <h2 className="form-heading"> Attachments </h2> 
                <table className="table table-bordered">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col"> File Name  </th>
                    <th scope="col"> File Type  </th>
                    <th scope="col"> Remarks </th>
                    <th scope="col"> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.Attachments.map((loopdata, index) => (  
                        <tr>
                            <td>{index + 1}</td>
                            <td>{loopdata.Filename}</td>
                            <td>{loopdata.Filetype}</td>
                            <td>{loopdata.Remarks}</td>
                            <td><a href={loopdata.URL} target="_blank"><img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/awesome-eye.svg"} alt="View"   data-tip="View"/></a></td>
                        </tr>
                    ))}  
                </tbody>
                </table>
                {(() => {
                if (this.state.Attachments.length <= 0) {
                    return (
                    <div>
                        <p className="text-center">No record found.</p>                 
                    </div>
                    )
                }
                })()}
                <h2 className="form-heading"> References  </h2> 
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col"> Reference Link  </th>
                        <th scope="col"> Remarks </th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.References.map((loopdata, index) => (  
                            <tr>
                                <td>{index + 1}</td>
                                <td>{loopdata.Reflink}</td>
                                <td>{loopdata.Remarks}</td>
                            </tr>
                        ))}  
                    </tbody>
                    </table>
                    {(() => {
                    if (this.state.References.length <= 0) {
                        return (
                        <div>
                            <p className="text-center">No record found.</p>                 
                        </div>
                        )
                    }
                    })()}
            </section>
            </div>
            <FloatingButton />
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

export default connect(mapStateToProps)(cancelledView);