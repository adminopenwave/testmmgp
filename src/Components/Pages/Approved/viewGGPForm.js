import React, { Component } from 'react';
import { Breadcrumb } from "react-bootstrap";
import { connect } from "react-redux";
import Moment from 'react-moment';
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import Spinner from 'react-bootstrap/Spinner';
import * as moment from 'moment';
import Barcodec from './Barcodec';


class viewGGPForm extends Component {
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
        GGP_CreatedDate: "",
        GoodsItem: [],
        Attachments: [],
        References: [],
        HistoryList: [],
        loading: "",
        Qrcodedata:"",
        GGPRequestorid:"",
        GGPReturnDate:"",
        GGPStatusQR:"",
        GGPLastApprover:"",
        GGPApprovedDate:"",
        LblRefernceno:"REFERNCE NO:-",
        LblRequesterId:"    REQUESTER ID:-",
        LblRequesterName:"  REQUESTER NAME:-",
        LblGoods:"  GOODS:-",
        LblReturnDate:" RETURN DATE:-",
        LblGGPStatus:"  GGP STATUS:-",
        LblLastApprover:"   LAST APPROVER:-",
        LblApprovedDate:"   APPROVED DATE:-",       
    };
  }

  componentDidMount() {
    this.setState({ loading: "Yes" })
    this.props.dispatch({ type: 'headerTitle', value: "Approved : View GGP Form" })
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
      //  console.log(data)
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
                        StatffInfo_StaffName: data.StatffInfo.Name,
                    })
                }
            }
            if(data.GGPDetails){
                console.log(data.GGPDetails)
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
                    GGP_CreatedDate: data.GGPDetails.CreatedDate,
                    GGPRequestorid: data.GGPDetails.RequesterId,
                    GGPReturnDate: data.GGPDetails.Returndate,
                    GGPStatusQR: data.GGPDetails.Ggpstatus,
                    GGPLastApprover: data.GGPDetails.LastApprover,
                    GGPApprovedDate: data.GGPDetails.ApprovedDate,
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
                
                this.setState({Qrcodedata: this.state.LblRefernceno + this.state.Referenceno + 
                   this.state.LblRequesterId + this.state.GGPRequestorid +
                   this.state.LblRequesterName + this.state.StatffInfo_StaffName + 
                   this.state.LblGoods + this.state.GoodsCategory_GoodsCategory+
                  this.state.LblReturnDate + ((this.state.GGPReturnDate) ? moment(this.state.GGPReturnDate).format("DD-MM-yyyy hh:mm:ss") : "") +
                  this.state.LblGGPStatus + this.state.GGPStatusQR +
                 this.state.LblLastApprover + this.state.GGPLastApprover +
                 this.state.LblApprovedDate + ((this.state.GGPApprovedDate) ? moment(this.state.GGPApprovedDate).format("DD-MM-yyyy hh:mm:ss") : "")  })
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
  
  printOrder = () => {
   
    window.print();
}

  render() {  
    const malasiyaDate  = moment(new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Singapore'
      })).format("DD-MM-yyyy");
    if(this.state.loading){
        return (
            <>
            <Breadcrumb id="non-printable">
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/approved/list"}>My Application : Approved List</Breadcrumb.Item>
            <Breadcrumb.Item active>View GGP Form</Breadcrumb.Item>
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
            <Breadcrumb id="non-printable">
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/approved/list"}>My Application : Approved List</Breadcrumb.Item>
            <Breadcrumb.Item active>View GGP Form</Breadcrumb.Item>
            </Breadcrumb>
            
            <div className="content-area" id="ggpPrint"> 
            
                <section>
                    <div className="row">
                    <div className="col-6 col-sm-3 order-1" >
                        <div className="img-code mx-auto" style={{width:"75px"}}>
                            <QRCode value={this.state.Qrcodedata} level={"H"} size={130}/>
                            
                        </div>
                        <div className="mt-3">
                            <p className="text-muted text-center mb-0"> GGP Reference No: {this.state.Referenceno} </p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-5 order-3 order-sm-2">
                        <div className="comp-heading">
                        <h4> Malaysia Marine and Heavy Engineering </h4>
                        <p className="mb-0"> Goods Gate Pass</p>
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 text-right order-2 order-sm-3">
                        <div className="img-code" style={{textAlign: "center !important"}}>
                            <Barcodec value={this.state.Referenceno} />
                        </div>
                    </div>
                   
                    </div>
                </section>
                <section className="print-form-heading clearfix">
                    <p className="float-left mb-0"> To : Security Department </p>
                    <p className="float-right mb-0"> Date Request : {malasiyaDate} </p>
                </section>
                <section>
                <h2 className="print-form-heading">Requester Information</h2>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Serial No </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Section} </b> </p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Requester Name</label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_StaffName}  </b> </p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Department </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Department}  </b> </p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Designation </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span>  {this.state.StatffInfo_Designation} </b> </p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                </section>
                
                <section>
                <h2 className="print-form-heading"> Authorize Information </h2>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="auth-cat" className="col-sm-4 col-form-label">Authorized Category </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedCategory}  </b> </p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="auth-name" className="col-sm-4 col-form-label">Authorized Name </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedName} </b> </p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {(() => {
                    if (this.state.AuthorizedCarrier_AuthorizedCategory === "MMHE Staff") {
                        return (
                            <>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-4 col-form-label"> Vehicle Number </label>
                                    <div className="col-sm-8">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_VehicleNumber} </b> </p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            </>
                        )
                    } else if (this.state.AuthorizedCarrier_AuthorizedCategory === "Supplier's Rep" || this.state.AuthorizedCarrier_AuthorizedCategory === "Subcontractor's Rep") {
                        return (
                            <>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group row mb-0">
                                        <label for="" className="col-sm-4 col-form-label"> IC Number </label>
                                        <div className="col-sm-8">
                                        <div className="input-group mb-2 mr-sm-2">
                                            <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_ICNumber}  </b> </p>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group row mb-0">
                                        <label for="" className="col-sm-4 col-form-label"> Authorized Company </label>
                                        <div className="col-sm-8">
                                        <div className="input-group mb-2 mr-sm-2">
                                            <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_AuthorizedCompany}  </b> </p>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group row mb-0">
                                        <label for="" className="col-sm-4 col-form-label"> Company Address </label>
                                        <div className="col-sm-8">
                                        <div className="input-group mb-2 mr-sm-2">
                                            <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_CompanyAddress} </b> </p>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group row mb-0">
                                        <label for="" className="col-sm-4 col-form-label"> Vehicle Number </label>
                                        <div className="col-sm-8">
                                        <div className="input-group mb-2 mr-sm-2">
                                            <div className="input-group mb-2 mr-sm-2">
                                            <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_VehicleNumber} </b> </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </>
                        )
                    } else {
                        return (
                        <>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-4 col-form-label"> IC Number </label>
                                    <div className="col-sm-8">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_ICNumber}  </b> </p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-4 col-form-label"> Company Address </label>
                                    <div className="col-sm-8">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_CompanyAddress} </b> </p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-4 col-form-label"> Vehicle Number </label>
                                    <div className="col-sm-8">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.AuthorizedCarrier_VehicleNumber} </b> </p>
                                        </div>
                                    </div>
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
                <h2 className="print-form-heading"> Goods Detail </h2> 
                <div className="row">
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Goods Category  </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_GoodsCategory} </b> </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label for="goods-type" className="col-sm-4 col-form-label"> Type of Goods </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_TypeofGoods} </b> </p>
                            </div>
                            </div>
                        </div>
                        <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Destination of goods  </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Destinationofgoods} </b> </p>
                            </div>
                            </div>
                        </div>
                             
                       
                        {(() => {
                            if (this.state.GoodsCategory_GoodsExittime !== "Office Hour") {
                            return (
                                <div className="form-group row mb-0">
                                    <label for="goods-exit-time" className="col-sm-4 col-form-label"> Exit Time Justification </label>
                                    <div className="col-sm-8">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Goodsexittimeremarks} </b> </p>
                                    </div>
                                    </div>
                                </div>
                                )
                            }
                        })()}  
                         {(() => {
                            if (this.state.GoodsCategory_GoodsCategory === "Returnable") {
                            return (
                            <div className="form-group row mb-0">
                                <label for="" className="col-sm-4 col-form-label"> Target Date of Return </label>
                                <div className="col-sm-8">
                                <div className="input-group mb-2 mr-sm-2">
                                    <p className="m-0 py-2"> 
                                        <b> <span className="d-none d-sm-inline"> : </span> 
                                        <td> {((this.state.GoodsCategory_TargetdateofReturn) ? moment(this.state.GoodsCategory_TargetdateofReturn).format("DD-MM-yyyy") : "") } </td>
                                        </b> 
                                    </p>
                                </div>
                                </div>
                            </div>
                            )
                            }
                        })()}
                         <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Company Name & Address </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_CompanyNameAddress} </b> </p>
                            </div>
                            </div>
                        </div>
                       
                    </div>
                    <div className="col-6">
                        <div className="form-group row mb-0">
                            <label for="purpose-exit" className="col-sm-4 col-form-label"> Purpose of Exit </label>
                            <div className="col-sm-8">
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
                                    <label for="purpose-exit" className="col-sm-4 col-form-label"> Purpose of Exit (Others) </label>
                                    <div className="col-sm-8">
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
                         <div className="form-group row mb-0">
                            <label for="" className="col-sm-4 col-form-label"> Status of Goods  </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Statusofgoods} </b> </p>
                            </div>
                            </div>
                        </div>
                        {(() => {
                            if (this.state.GoodsCategory_Statusofgoods === "Others") {
                            return (
                                <div className="form-group row mb-0">
                                    <label for="" className="col-sm-4 col-form-label"> Status of Goods (Others)  </label>
                                    <div className="col-sm-8">
                                    <div className="input-group mb-2 mr-sm-2">
                                        <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_Goodsstatusremarks} </b> </p>
                                    </div>
                                    </div>
                                </div>
                            )
                            }
                        })()}
                         <div className="form-group row mb-0">
                            <label for="goods-exit-time" className="col-sm-4 col-form-label">  Goods Exit Time </label>
                            <div className="col-sm-8">
                            <div className="input-group mb-2 mr-sm-2">
                                <p className="m-0 py-2"> <b> <span className="d-none d-sm-inline"> : </span> {this.state.GoodsCategory_GoodsExittime} </b> </p>
                            </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
               
                </section>               
                  <section>
                <h2 className="print-form-heading"> Goods Item </h2> 
                <table className="table table-bordered print-table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col"> Qty </th>
                    <th scope="col"> Serial No </th>
                    {/* <th scope="col"> Qty to be Return </th> */}
                    <th scope="col"> Description  </th>
                    
                    </tr>
                </thead>
                <tbody>                   
                    {this.state.GoodsItem.map((loopdata, index) => (  
                         <tr>
                             <td>{index + 1}</td>
                             <td>{loopdata.Qtyunit}</td>
                              <td>{loopdata.Serialno}</td>
                              {/* <td>{loopdata.Qtyreturn}</td> */}
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
            <h2 className="print-form-heading"> Approval History </h2>
            <div className="table-responsive custom-table-1 print-table">
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
                            <td> {((loopdata.Createddate) ? moment(loopdata.Createddate).format("DD-MM-yyyy hh:mm:ss") : "") } </td>
                            <td> {loopdata.Description} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </section>
        <section>
            <div className="row">
            <div className="col-sm-3">

            </div>
            <div className="col-sm-9">
                <div className="table-responsive">
                <table className="table table-bordered print-table">
                    <thead className="text-center">
                    <tr>
                        <th scope="col" colspan="2"> Returnable Out </th>
                        <th scope="col" colspan="2"> Returnable In </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="text-center">
                        <th scope="col" colspan="2"> Security Verified </th>
                        <th scope="col" colspan="2"> Security Verified </th>
                    </tr>
                   
                 
                    <tr>
                        <td className="w-150"> Name </td>
                        <td> </td>
                        <td className="w-150"> Name </td>
                        <td> </td>
                    </tr>
                    <tr>
                        <td className="w-150"> Employee ID </td>
                        <td> </td>
                        <td className="w-150"> Employee ID </td>
                        <td> </td>
                    </tr>
                    <tr>
                        <td className="w-150"> Signature </td>
                        <td> </td>
                        <td className="w-150"> Signature </td>
                        <td> </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </section>
                
            </div>
            <button type="button" className="btn btn-create-request" id="non-printable" onClick={() => this.printOrder()}>
            <i className="fa fa-print p_5"></i>
            <span className="cr-text">&nbsp;Print </span>
        </button>
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

export default connect(mapStateToProps)(viewGGPForm);