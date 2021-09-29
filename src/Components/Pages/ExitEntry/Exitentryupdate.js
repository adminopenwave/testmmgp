import React, { Component } from 'react';
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import Select from 'react-select';
import {toast} from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import SimpleReactValidator from 'simple-react-validator';
import { event } from 'jquery';
import { Block } from '@material-ui/icons';

toast.configure();
class Exitentryupdate extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator1 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
      GoodsActionArray: [],
      SectionlistArray: [],
      StaffDetailslistArray: [],
      GGPExitEntryArray: [],
      deletePopup: false,
      deleteId: "",
      loading: "",
      popupEmployeeId: "",
      popupEmployeeName: "",
      GoodsAction: "",
      Inspectedbypopup: false,
      VerifiedBypopup: false,
      Verifiedby: "",
      Verifiedbyname: "",
      GGPReferenceNo: "",
      actionStatus: "Add",
      addbuttonStatus: "disabled",
      stafflistArraySpin : "none",
      addbtnstatus:"Add",
      goodsactionremarks:"",
      getmsgwfstatus:"",
      getmsgggpstatus:"",
      warnmsgrefernecno:"",
      warnmsgdivtag:"",
      displaystatus:"none",
      userRole: this.props.userType,
    };  
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "GGP Exit & Entry update" })
    this.loginemployeename()
    this.GetGoodsAction()
    this.GetSectionListData()
    
  }
 

  GetGoodsAction = () =>{
    let postData = {
      Mode: "SecurityAction"
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetGGPMaster', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
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
        this.setState({ GoodsActionArray:  data.MasterList })
          if(this.state.userRole === "SecurityOfficer" && this.state.GoodsActionArray.length > 2){           
            var array = this.state.GoodsActionArray
            array.splice(2,1);
            this.setState({GoodsActionArray: array});}
      }
    })
  }

  GetSectionListData = (val) => {
    // alert('a')
    let postData = { Mode: 'Section' }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetGGPMaster', {
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
        this.setState({ SectionlistArray: data.MasterList })
      }
    })
  }

  handleChange = (e) => {
    switch (e.target.name) {
      case "popupEmployeeId":
        this.setState({ popupEmployeeId: e.target.value })
        break;
      case "popupEmployeeName":
        this.setState({ popupEmployeeName: e.target.value })
        break;
      case "status":
        this.setState({ popupEmployeeName: e.target.value })
        break;
      case "Goodstype":
        this.setState({ Goodstype: e.target.value })
        break;
      case "Active":
        this.setState({ Active: e.target.value })
        break;
      case "GoodsAction":
        this.setState({ GoodsAction: e.target.value}, ()=>this.checkCanGGP()) 
        break;
      case "GGPReferenceNo":
        this.setState({ GGPReferenceNo: e.target.value }, ()=>this.checkCanGGP())
        break;
      case "Goodsactionremarks":
        this.setState({ goodsactionremarks: e.target.value })
        break;
      default: break;
      }
  }

  handleSelectFormFields = selectedOption => {
    switch (selectedOption.id) {
      case "popupSection":
        this.setState({ popupSection: selectedOption.value })
        break;
      default: break;
    }
  }

  searchEmployeeClear = () =>{
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [],stafflistArraySpin: "none"  })
  }

  loginemployeename = () => {
    // alert('a')
    this.setState({stafflistArraySpin: "", StaffDetailslistArray:[]})
    let postData = { 
        EmployeeId: this.props.UserId,
        Name: this.state.popupEmployeeName,
        Section: this.state.popupSection,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetStaffDetails', {
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
        this.setState({Verifiedby: this.props.UserId, Verifiedbyname: data.StaffDetails[0].Name})
      }
    })
  }

  searchEmployee = () => {
    // alert('a')
    this.setState({stafflistArraySpin: "", StaffDetailslistArray:[]})
    let postData = { 
        EmployeeId: this.state.popupEmployeeId,
        Name: this.state.popupEmployeeName,
        Section: this.state.popupSection,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetStaffDetails', {
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
        this.setState({ StaffDetailslistArray: data.StaffDetails,stafflistArraySpin: "none"  })        
      }
    })
  }

  getInspectedbyshow = () =>{
    this.setState({ Inspectedbypopup:  true, popupEmployeeId: "",  popupEmployeeName: "",stafflistArraySpin: "none"})
  }

  getInspectedbyhide = () =>{
    this.setState({ Inspectedbypopup:  false, popupEmployeeId: "",  popupEmployeeName: ""})
  }

  getInspectedbyDetails = (id, name) =>{
    this.setState({ Inspectedby: id, Inspectedbyname: name, Inspectedbypopup: false })
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  getApprovershow = () =>{
    this.setState({VerifiedBypopup:true, stafflistArraySpin: "none"})
  }

  getVerifiedBypopuphide = () =>{
    this.setState({ VerifiedBypopup:  false, popupEmployeeId: "",  popupEmployeeName: ""})
  }

  getVerifiedByDetails = (id, name) =>{
    this.setState({ Verifiedby: id, Verifiedbyname: name, VerifiedBypopup: false })
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

 

  Add = () =>{
    this.setState({ actionStatus: "Add" ,addbtnstatus:<Spinner animation="border" className="dashboard-count-spinner"/>, addbuttonStatus: "disabled",})
    if(this.state.GoodsAction === "Revise Order" || this.state.GoodsAction === "Reset GGP"){
   
      if (this.validator1.allValid()) {
        
        let postData1 = { 
          Referenceno: this.state.GGPReferenceNo,
          GoodsAction: ((this.state.GoodsAction === "Reset GGP" ? "Cancel GGP" : this.state.GoodsAction)),
          Remarks: this.state.goodsactionremarks,
        }
        fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/ExitEntry/ValidateReferenceNo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.getToken,
        },
        body: JSON.stringify(postData1)
        }).then(response=>{
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
              this.props.dispatch({ type: 'Token', value: "" });
              this.props.dispatch({ type: 'profile', value: "" });
              this.props.dispatch({ type: 'userType', value: "" });
          }
        })
        .then(data1 => {
            if(data1.Status === "Failed"){           
              toast.error(data1.Message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
              });
            }else{
              let postData = { 
                Referenceno: this.state.GGPReferenceNo 
              }
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
                  this.setState({addbtnstatus: "Add", addbuttonStatus: "",})
                  if(data){
                    if(data.GGPDetails){
                      if(this.state.GGPExitEntryArray){
                        let GGPExitEntryValue = this.state.GGPExitEntryArray;
                          let valuesList = { 
                            GoodsAction: this.state.GoodsAction,
                            Inspectedby: this.state.Inspectedby,
                            Inspectedbyname: this.state.Inspectedbyname,
                            Verifiedby: this.state.Verifiedby,
                            Verifiedbyname: this.state.Verifiedbyname,
                            Referenceno: this.state.GGPReferenceNo,
                            GoodsType: data.GGPDetails.Goodstype,
                            ExitPurpose: data.GGPDetails.Exitpurpose,
                            Goodsexittime: data.GGPDetails.Goodsexittime,
                            goodsactionremarks: ((data.GGPDetails.Remarks) ? data.GGPDetails.Remarks : this.state.goodsactionremarks),
                          }
                          GGPExitEntryValue.push(valuesList)				
                          this.setState({ 
                            GGPExitEntryArray: GGPExitEntryValue,
                            GoodsAction: "",
                            Inspectedby: "",
                            Inspectedbyname: "",
                            GGPReferenceNo: "",
                            Goodsexittime: "",
                          })
                      }else{
                        let GGPExitEntryValue = [];
                          let valuesList = { 
                            GoodsAction: this.state.GoodsAction,
                            Inspectedby: this.state.Inspectedby,
                            Inspectedbyname: this.state.Inspectedbyname,
                            Verifiedby: this.state.Verifiedby,
                            Verifiedbyname: this.state.Verifiedbyname,
                            Referenceno: this.state.GGPReferenceNo,
                            GoodsType: data.GGPDetails.Goodstype,
                            ExitPurpose: data.GGPDetails.Exitpurpose,
                            Goodsexittime: data.GGPDetails.Goodsexittime,
                            goodsactionremarks: this.state.goodsactionremarks,
                          }
                          GGPExitEntryValue.push(valuesList)				
                          this.setState({ GGPExitEntryArray: GGPExitEntryValue, actionStatus: "Add" })
                      }
                    }else{
                      toast.error("Reference No not exist.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                      });
                    }
                  }
              })
            }
      })
      } else {
        this.setState({addbtnstatus: "Add",addbuttonStatus:""})
        this.validator1.showMessages();
        console.log("error msg one showing")
        this.forceUpdate();
      }
    }
    else{
      if (this.validator.allValid()) {

        let postData1 = { 
          Referenceno: this.state.GGPReferenceNo,
          GoodsAction: ((this.state.GoodsAction === "Reset GGP" ? "Cancel GGP" : this.state.GoodsAction)),
          Remarks: this.state.goodsactionremarks,
        }
        fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/ExitEntry/ValidateReferenceNo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.getToken,
        },
        body: JSON.stringify(postData1)
        }).then(response=>{
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
              this.props.dispatch({ type: 'Token', value: "" });
              this.props.dispatch({ type: 'profile', value: "" });
              this.props.dispatch({ type: 'userType', value: "" });
          }
        })
        .then(data1 => {
            if(data1.Status === "Failed"){           
              toast.error(data1.Message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
              });
            }else{
              let postData = { 
                Referenceno: this.state.GGPReferenceNo 
              }
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
                  this.setState({addbtnstatus: "Add", addbuttonStatus: "",})
                  if(data){
                    if(data.GGPDetails){
                      if(this.state.GGPExitEntryArray){
                        let GGPExitEntryValue = this.state.GGPExitEntryArray;
                          let valuesList = { 
                            GoodsAction: this.state.GoodsAction,
                            Inspectedby: this.state.Inspectedby,
                            Inspectedbyname: this.state.Inspectedbyname,
                            Verifiedby: this.state.Verifiedby,
                            Verifiedbyname: this.state.Verifiedbyname,
                            Referenceno: this.state.GGPReferenceNo,
                            GoodsType: data.GGPDetails.Goodstype,
                            ExitPurpose: data.GGPDetails.Exitpurpose,
                            Goodsexittime: data.GGPDetails.Goodsexittime,
                            goodsactionremarks: data.GGPDetails.Remarks,
                          }
                          GGPExitEntryValue.push(valuesList)	
                          this.setState({ 
                            GGPExitEntryArray: GGPExitEntryValue,
                          })	
                          this.validator.hideMessages();
                          this.validator1.hideMessages();
                         
                            this.setState({ 
                              GoodsAction: "",
                              Inspectedby: "",
                              Inspectedbyname: "",
                              GGPReferenceNo: "",
                              Goodsexittime: "",
                            })
                            
                         
                      }else{
                        let GGPExitEntryValue = [];
                          let valuesList = { 
                            GoodsAction: this.state.GoodsAction,
                            Inspectedby: this.state.Inspectedby,
                            Inspectedbyname: this.state.Inspectedbyname,
                            Verifiedby: this.state.Verifiedby,
                            Verifiedbyname: this.state.Verifiedbyname,
                            Referenceno: this.state.GGPReferenceNo,
                            GoodsType: data.GGPDetails.Goodstype,
                            ExitPurpose: data.GGPDetails.Exitpurpose,
                            Goodsexittime: data.GGPDetails.Goodsexittime,
                            goodsactionremarks: this.state.goodsactionremarks,
                          }
                          GGPExitEntryValue.push(valuesList)				
                          this.setState({ GGPExitEntryArray: GGPExitEntryValue, actionStatus: "Add" })
                      }
                    }else{
                      toast.error("Reference No not exist.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                      });
                    }
                  }
              })
            }
      })
      } else {
        this.setState({addbtnstatus: "Add", addbuttonStatus:""})
        this.validator.showMessages();
        console.log("errormsg showing here")
        this.forceUpdate();
      }
    }
    
  }
 

  checkCanGGP = () =>{
    
    if(this.state.GGPReferenceNo){
      let postData1 = { 
        Referenceno: this.state.GGPReferenceNo,
        GoodsAction: ((this.state.GoodsAction === "Reset GGP" ? "Cancel GGP" : this.state.GoodsAction))
      }
      fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/ExitEntry/ValidateReferenceNo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.getToken,
      },
      body: JSON.stringify(postData1)
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
        console.log(data.Message)
        if(data?.Status === "Failed"){        
          
          if(data.message !== "Invalid Reference No")
          {
            this.setState({GGPRefernceNoMessage: "Invalid Reference No" })
          }
          else{
            this.setState({GGPRefernceNoMessage: data.Message})
          }

          if(data.GGPStatus === null){
            this.setState({getmsgggpstatus:""})
          }else{
            this.setState({getmsgggpstatus: data.GGPStatus})
          }

          if(data.WFStatus === null){
            this.setState({getmsgwfstatus:""})
          }else{
            this.setState({getmsgwfstatus: data.WFStatus})
          }

          if(this.state.getmsgggpstatus !==""){
            this.setState({warnmsgdivtag:  <div> 
              {((this.state.GGPRefernceNoMessage) &&(<div class="text-danger">{this.state.GGPRefernceNoMessage} (<i> <span className="f-s-12">  Approval status : {this.state.getmsgwfstatus} , GGP status : {this.state.getmsgggpstatus} </span> </i>  ) </div>))} 
              </div>})
          }
          else if(this.state.getmsgwfstatus !=""){
            this.setState({warnmsgdivtag:  <div> 
              {((this.state.GGPRefernceNoMessage) &&(<div class="text-danger">{this.state.GGPRefernceNoMessage} (<i> <span className="f-s-12">  Approval status : {this.state.getmsgwfstatus}  </span> </i>  ) </div>))} 
              </div>})
          }
          else{
            this.setState({warnmsgdivtag: <div>{((this.state.GGPRefernceNoMessage) &&(<div class="text-danger">{this.state.GGPRefernceNoMessage} </div>))} </div> })
          }
            
          this.setState({addbuttonStatus: "disabled",displaystatus:"show"});
          console.log(this.state.displaystatus)

        }else{
            this.setState({GGPRefernceNoMessage: "",getmsgwfstatus:"", getmsgggpstatus:"" ,addbuttonStatus: "",displaystatus:"none"});
            console.log(this.state.displaystatus)
        }
      })
    }
  }

  removeThis = (indexVal) =>{
    var array = this.state.GGPExitEntryArray
    array.splice(indexVal, 1);
    this.setState({GGPExitEntryArray: array});
  }

  editThis = (indexVal) =>{
    
    var array = this.state.GGPExitEntryArray
    this.setState({
      actionStatus: "Update",
      GoodsAction: array[indexVal].GoodsAction,
      Inspectedby: array[indexVal].Inspectedby,
      Inspectedbyname: array[indexVal].Inspectedbyname,
      Verifiedby: array[indexVal].Verifiedby,
      Verifiedbyname: array[indexVal].Verifiedbyname,
      GGPReferenceNo: array[indexVal].Referenceno,
    });
    array.splice(indexVal, 1);
    this.setState({GGPExitEntryArray: array});
  }
  
  Update = () =>{
    let canRedirect = 1;
    var array = this.state.GGPExitEntryArray
    array.forEach((list, index) => {
      console.log(list)
      let postData = {
        Mode: "Add",
        Referenceno: list.Referenceno,
        GoodsAction: ((list.GoodsAction === "Reset GGP" ? "Cancel GGP" : list.GoodsAction)),        
        Inspectedby: list.Inspectedby,
        Verifiedby: list.Verifiedby,
        Remarks: list.goodsactionremarks,
      }
      fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/ExitEntry/InsertUpdateExitEntry', {
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
          if(data.Status === "Failed"){
            canRedirect = 0
            toast.error(data.Message, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          }
          if(data.Status === "Success"){
            array.splice(index, 1);
            this.setState({GGPExitEntryArray: array});
            toast.success(data.Message, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          }
        }
      })
      if(this.state.GGPExitEntryArray.length === (index + 1)){
        setTimeout(() => {
          if(canRedirect === 1){
            this.props.history.push({ pathname: "/exitentry/list" });
          }
        }, 1000);
      }
    })
  }

  Cancel = () =>{
    this.setState({GGPExitEntryArray: []});
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.searchEmployee()
    }
  }

  viewRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.open(process.env.REACT_APP_ENV +"/exitentry/view?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString()), "_blank")
  }

  render() {
    let sectionOptionList = [];
    if(this.state.SectionlistArray){
      this.state.SectionlistArray.map(data => {
      let sData = { id: "popupSection", label: data.Code, value: data.Code }
        sectionOptionList.push(sData)				
        return null;
      })
    }
     
    return (
       <>
        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>GGP Exit & Entry update</Breadcrumb.Item>
        </Breadcrumb>
      <div className="content-area shadow p-3 mb-5 bg-white rounded">
      <section className="p-3">
        <div className="form-group row">
          <label for="" className="col-sm-2 col-form-label text-muted">
            Goods Action *
          </label>
          <div className="col-sm-3">
            <div className="form-group">
              <select className="form-control classic classicSelect" name="GoodsAction" value={this.state.GoodsAction}  onChange={this.handleChange}>
              <option> Please select </option>
                {this.state.GoodsActionArray.map((loopdata, index) => (  
                    <option value={loopdata.Description}> {loopdata.Description} </option>
                ))}  
              </select>
            </div>
            {
              this.validator.message('Goods Action', this.state.GoodsAction, 'required')
            }
          </div>
        </div>

        {(() => {
            if (this.state.GoodsAction === "Revise Order" || this.state.GoodsAction === "Reset GGP") {
              return (
                <div>
                <div className="form-group row">
                <label for="goods-action-remark" className="col-sm-2 col-form-label text-muted">  Goods Action Justification * </label>
               
                <div className="col-sm-6">
                
                <div className="input-group mb-2 mr-sm-2">                   
                  <textarea  className="form-control" id="" placeholder="" rows="3" name="Goodsactionremarks" value={this.state.goodsactionremarks} onChange={this.handleChange}></textarea>
                </div> 
             
                      {
                        this.validator1.message('Goods Action remarks', this.state.goodsactionremarks, 'required')
                      } 
                    
                </div>
              </div>  
                <div className="form-group row mb-2">
                <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                  Physical Inspected By *
                </label>
                <div className="col-sm-2">
                  <div className="form-group">
                    <input type="text" className="form-control" readOnly={true} onClick={this.getInspectedbyshow} value={this.state.Inspectedby}/>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                  <div className="input-group mb-2 mr-sm-2"   >
                    <input type="text" className="form-control" id="" placeholder="" onClick={this.getInspectedbyshow}  readOnly={true} value={this.state.Inspectedbyname}/>
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-search text-muted" onClick={this.getInspectedbyshow}> </i>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div className="form-group row mb-2">
                <div className="col-sm-2"> </div>
                <div className="col-sm-5">
                  {
                    this.validator1.message('Physical Inspected By', this.state.Inspectedby, 'required')
                  }
                </div>
              </div>
              <div className="form-group row mb-2">
                <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                  Verified By *
                </label>
                <div className="col-sm-2">
                  <div className="form-group">
                    <input type="text" className="form-control" readOnly={true} onClick={this.getApprovershow} value={this.state.Verifiedby}/>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                  <div className="input-group mb-2 mr-sm-2" >
                    <input type="text" className="form-control" id="" onClick={this.getApprovershow} placeholder="" readOnly={true} value={this.state.Verifiedbyname}/>
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-search text-muted"onClick={this.getApprovershow}> </i>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div className="form-group row mb-2">
                <div className="col-sm-2"> </div>
                <div className="col-sm-5">
                  {
                    this.validator1.message('Verified By', this.state.Verifiedby, 'required')
                  }
                </div>
              </div>
              <div className="form-group row">
                <label for="" className="col-sm-2 col-form-label text-muted"> GGP Reference No *  </label>
                <div className="col-sm-3">
                  <div className="input-group mb-2 mr-sm-2">
                    <input type="text" className="form-control" id=""   placeholder="" name="GGPReferenceNo" value={this.state.GGPReferenceNo} onChange={this.handleChange}/>
                  </div>
                  {
                    this.validator1.message('ggp Reference No', this.state.GGPReferenceNo, 'required')
                  }
      
                </div>
                <div>
                
                {(() => {
                  if (this.state.actionStatus === "Add") {
                    return (
                      <button type="button" disabled={(this.state.addbuttonStatus === "disabled") ? true : false} className={`${(this.state.addbuttonStatus === "disabled" ? "btn btn-secondary" : "btn btn-primary-01")}`} onClick={this.Add}> <i className="fa fa-plus p_5"></i> {this.state.addbtnstatus}</button>
                    )
                  }else{
                    return (
                      <button type="button" className="btn btn-primary-01" onClick={this.Add}> <i className="fa fa-edit p_5"></i> Add</button>
                    )
                  }
                })()}
                 
                </div>
              </div>
           
             
              <div className="form-group row">
                <div className="col-sm-2"> </div>
                <div className="col-sm-5 text-left " className={`${(this.state.displaystatus === "none" ? "d-none" : "d-block")}`}> 
                {this.state.warnmsgdivtag}
                </div>          
              </div>  
            </div>
              )
            }
            else{
              return (
           <div>
            <div className="form-group row mb-2">
          <label for="auth-name" className="col-sm-2 col-form-label text-muted">
            Physical Inspected By *
          </label>
          <div className="col-sm-2">
            <div className="form-group">
              <input type="text" className="form-control" readOnly={true} onClick={this.getInspectedbyshow} value={this.state.Inspectedby}/>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group">
            <div className="input-group mb-2 mr-sm-2"   >
              <input type="text" className="form-control" id="" placeholder="" onClick={this.getInspectedbyshow}  readOnly={true} value={this.state.Inspectedbyname}/>
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fa fa-search text-muted" onClick={this.getInspectedbyshow}> </i>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="form-group row mb-2">
          <div className="col-sm-2"> </div>
          <div className="col-sm-5">
            {
              this.validator.message('Physical Inspected By', this.state.Inspectedby, 'required')
            }
          </div>
        </div>
        <div className="form-group row mb-2">
          <label for="auth-name" className="col-sm-2 col-form-label text-muted">
            Verified By *
          </label>
          <div className="col-sm-2">
            <div className="form-group">
              <input type="text" className="form-control" readOnly={true} onClick={this.getApprovershow} value={this.state.Verifiedby}/>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group">
            <div className="input-group mb-2 mr-sm-2" >
              <input type="text" className="form-control" id="" onClick={this.getApprovershow} placeholder="" readOnly={true} value={this.state.Verifiedbyname}/>
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="fa fa-search text-muted"onClick={this.getApprovershow}> </i>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="form-group row mb-2">
          <div className="col-sm-2"> </div>
          <div className="col-sm-5">
            {
              this.validator.message('Verified By', this.state.Verifiedby, 'required')
            }
          </div>
        </div>
        <div className="form-group row">
          <label for="" className="col-sm-2 col-form-label text-muted"> GGP Reference No *  </label>
          <div className="col-sm-3">
            <div className="input-group mb-2 mr-sm-2">
              <input type="text" className="form-control" id=""   placeholder="" name="GGPReferenceNo" value={this.state.GGPReferenceNo} onChange={this.handleChange}/>
            </div>
            {
              this.validator.message('ggp Reference No', this.state.GGPReferenceNo, 'required')
            }

          </div>
          <div>
          
          {(() => {
            if (this.state.actionStatus === "Add") {
              return (
                <button type="button" disabled={(this.state.addbuttonStatus === "disabled") ? true : false} className={`${(this.state.addbuttonStatus === "disabled" ? "btn btn-secondary" : "btn btn-primary-01")}`} onClick={this.Add}> <i className="fa fa-plus p_5"></i> {this.state.addbtnstatus}</button>
              )
            }else{
              return (
                <button type="button" className="btn btn-primary-01" onClick={this.Add}> <i className="fa fa-edit p_5"></i> Add</button>
              )
            }
          })()}
           
          </div>
        </div>
     
       
        <div className="form-group row">
          <div className="col-sm-2"> </div>
          <div className="col-sm-5 text-left " className={`${(this.state.displaystatus === "none" ? "d-none" : "d-block")}`}> 
          {this.state.warnmsgdivtag}
          </div>          
        </div>
                  </div>
               ) } 
          })()}

       

        {(() => {
          if (this.state.GGPExitEntryArray.length > 0) {
            return (
              <div className="text-right text-sm-right">
                <button className="btn btn-primary-01" type="button" onClick={this.Update}>
                <i class="fa fa-edit"></i> Update
                </button>
                <button className="btn btn-outline-info ml-3 float-center float-sm-none" type="button" onClick={this.Cancel}>
                <i class="fa fa-times"></i> Cancel
                </button>
              </div>
            )
          }
        })()}
      </section>
      </div>
      {(() => {
          if (this.state.GGPExitEntryArray.length > 0) {
            return (
              <div className="content-area shadow p-3 mb-5 bg-white rounded">
                <section className="p-3">
                  <div className="table-responsive"> 
                    <table className="table table-hover">
                      <thead className="thead-lightBlue">
                        <tr>
                          <th scope="col"> Goods Action </th>
                          <th scope="col"> Inspected By  </th>
                          <th scope="col"> Verified By  </th>
                          <th scope="col"> GGP Reference No </th>
                          <th scope="col"> Goods Type </th>
                          <th scope="col"> Exit Purpose </th>
                          <th scope="col"> Goods Exit Time </th>
                          <th scope="col" className="position-relative"> 
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.GGPExitEntryArray.map((value, index) => (  
                          <tr>  
                            <td> {value.GoodsAction} </td>
                            <td> 
                              <div>{value.Inspectedbyname}</div>
                              <div>({value.Inspectedby})</div>
                            </td>
                            <td> 
                              <div>{value.Verifiedbyname}</div>
                              <div>({value.Verifiedby})</div>
                            </td>
                            <td className="text-to-link" onClick={() => this.viewRequest(value.Referenceno)}> {value.Referenceno} </td>
                            <td> {value.GoodsType} </td>
                            <td> {value.ExitPurpose} </td>
                            <td> {value.Goodsexittime} </td>
                            <td> 
                              <p>
                                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/ionic-md-close.svg"} alt="Remove" onClick={()=>this.removeThis(index)} /> 
                                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/edit-solid.svg"} data-tip="Edit" alt="Edit" onClick={()=>this.editThis(index)}/> 
                              </p> 
                            </td>
                        </tr>
                        ))}  
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )
            }
          })()}
      <Modal show={this.state.Inspectedbypopup} size="lg">  
        <Modal.Header >Employee Look Up</Modal.Header>  
        <Modal.Body>
          <section className="p-3">
            <div className="form-group row mb-1">
              <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Employee Id
              </label>
              <div className="col-sm-4">
                <div className="form-group">
                  <input type="number" className="form-control" name="popupEmployeeId" value={this.state.popupEmployeeId} onChange={this.handleChange} onKeyDown={this._handleKeyDown}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Employee Name
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <input type="text" className="form-control" name="popupEmployeeName" value={this.state.popupEmployeeName} onChange={this.handleChange} onKeyDown={this._handleKeyDown}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="auth-cat" className="col-sm-3 col-form-label text-muted">
                Section
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <Select options={sectionOptionList} onChange={this.handleSelectFormFields} onKeyDown={this._handleKeyDown}/>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={()=>this.searchEmployeeClear()}> Clear </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.searchEmployee}> Search </Button>  
            </div>
          </section>
          <hr></hr>
          <section> 
            <h2 className="fs-title"> </h2>
            <div className="table-responsive max-height-280"> 
              <table className="table table-hover">
                <thead className="thead-lightBlue">
                  <tr>
                    <th scope="col"> Action  </th>
                    <th scope="col"> Employee No  </th>
                    <th scope="col"> User Name  </th>
                    <th scope="col"> Account  </th>
                    <th scope="col"> Email </th>
                    <th scope="col"> Section </th>
                    <th scope="col"> Section Name </th>
                </tr>
                </thead>
                <tbody>
                  {this.state.StaffDetailslistArray.map((staff, index) => (  
                      <tr onClick={()=>this.getInspectedbyDetails(staff.EmployeeId, staff.Name)} className="cursor-pointer">  
                        <td> <p> <span className="material-icons-outlined select-employee-icon"> how_to_reg </span> </p> </td>
                          <td> {staff.EmployeeId} </td>
                          <td> {staff.Name} </td>
                          <td> ({staff.Account}) </td>
                          <td> {staff.Email} </td>
                          <td> {staff.Section} </td>
                          <td> {staff.SectionName} </td>
                    </tr>
                  ))}  
                </tbody>
              </table>
              {(() => {
                  if (this.state.StaffDetailslistArray.length <= 0 && this.state.stafflistArraySpin === "none") {
                    return (
                      <p className="text-center">No record found.</p>                 
                    )
                  }
                })()}
                <p className="text-center"><Spinner animation="border" variant="primary" style={{display: this.state.stafflistArraySpin }} className="text-center" /></p>
            </div>
          </section>
        </Modal.Body>  
        <Modal.Footer>  
          <Button className="btn btn-light" onClick={()=>this.getInspectedbyhide()}>Close</Button>  
        </Modal.Footer>  
      </Modal>

      <Modal show={this.state.VerifiedBypopup} size="lg">  
        <Modal.Header >Employee Look Up</Modal.Header>  
        <Modal.Body>
          <section className="p-3">
            <div className="form-group row mb-1">
              <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Employee Id
              </label>
              <div className="col-sm-4">
                <div className="form-group">
                  <input type="number" className="form-control" name="popupEmployeeId" value={this.state.popupEmployeeId} onChange={this.handleChange} onKeyDown={this._handleKeyDown}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Employee Name
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <input type="text" className="form-control" name="popupEmployeeName" value={this.state.popupEmployeeName} onChange={this.handleChange} onKeyDown={this._handleKeyDown}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="auth-cat" className="col-sm-3 col-form-label text-muted">
                Section
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <Select options={sectionOptionList} onChange={this.handleSelectFormFields} onKeyDown={this._handleKeyDown}/>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={()=>this.searchEmployeeClear()}> Clear </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.searchEmployee}> Search </Button>  
            </div>
          </section>
          <hr></hr>
          <section> 
            <h2 className="fs-title"> </h2>
            <div className="table-responsive max-height-280"> 
              <table className="table table-hover">
                <thead className="thead-lightBlue">
                  <tr>
                    <th scope="col"> Action  </th>
                    <th scope="col"> Employee No  </th>
                    <th scope="col"> User Name  </th>
                    <th scope="col"> Account  </th>
                    <th scope="col"> Email </th>
                    <th scope="col"> Section </th>
                    <th scope="col"> Section Name </th>
                </tr>
                </thead>
                <tbody>
                  {this.state.StaffDetailslistArray.map((staff, index) => (  
                      <tr onClick={()=>this.getVerifiedByDetails(staff.EmployeeId, staff.Name)} className="cursor-pointer">  
                        <td> <p> <span className="material-icons-outlined select-employee-icon"> how_to_reg </span> </p> </td>
                          <td> {staff.EmployeeId} </td>
                          <td> {staff.Name} </td>
                          <td> ({staff.Account}) </td>
                          <td> {staff.Email} </td>
                          <td> {staff.Section} </td>
                          <td> {staff.SectionName} </td>
                    </tr>
                  ))}  
                </tbody>
              </table>
              {(() => {
                  if (this.state.StaffDetailslistArray.length <= 0 && this.state.stafflistArraySpin === "none") {
                    return (
                      <p className="text-center">No record found.</p>                 
                    )
                  }
                })()}
                <p className="text-center"><Spinner animation="border" variant="primary" style={{display: this.state.stafflistArraySpin }} className="text-center" /></p>
            </div>
          </section>
        </Modal.Body>  
        <Modal.Footer>  
          <Button className="btn btn-light" onClick={()=>this.getVerifiedBypopuphide()}>Close</Button>  
        </Modal.Footer>  
      </Modal>
      <FloatingButton/>
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

export default connect(mapStateToProps)(Exitentryupdate);