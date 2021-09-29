import React, { Component } from "react";
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import { connect } from "react-redux";
import DatePicker from 'react-date-picker';
import $ from 'jquery'; // <-to import jquery
import 'bootstrap';
import Select from 'react-select';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropzone from 'react-dropzone';
import SimpleReactValidator from 'simple-react-validator';
import Spinner from 'react-bootstrap/Spinner';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert } from "bootstrap";
import * as moment from 'moment';

toast.configure();

class pendingEdit extends Component {
  constructor(props) {
    super(props);
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    var Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.validator1 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator2_1 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator2_2 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator2_3 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator3 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator5 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator5_2 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator6 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
      step1:"block",
      step2:"none",
      step3:"none",
      step4:"none",
      step5:"none",
      stepbarballon: 1,
      show:false,
      value:new Date(),
      Referenceno: Referenceno,
      getEmployeeFirstShow:false,
      getAuthorizedNameSecondShow:false,
      getAuthorizedCompanySecondShow:false,
      goodsItemEdit:false,
      goodsItemdeletePopup:false,
      editAttachments:false,
      editReferences:false,
      GoodsItemAdd:"none",
      SectionlistArray: [],
      StaffDetailslistArray: [],
      companylistArray: [],
      VehiclelistArray: [],
      TypeofGoodslistArray: [],
      ExitPurposelistArray: [],
      AuthCategorylistArray: [],
      ExitTimelistArray: [],
      StatusofGoodslistArray: [],
      GoodsItemslistArray: [],
      AttachmentslistArray: [],
      ReferenceLinkslistArray: [],
      popupEmployeeId: "",
      popupEmployeeName: "",
      popupSection: "",
      RequesterId: "",
      RequesterName: "",
      RequesterSection: "",
      RequesterSectionName: "",
      RequesterDepartment: "",
      RequesterDivision: "",
      RequesterDesignation: "",
      RequesterDisplayName: "",
      Description: "",
      UserId: this.props.UserId,
      canStafNamePopover: "none",
      Section: "",
      SectionName: "",
      Department: "",
      Division: "",
      Designation: "",
      Authorizedcategory: "MMHE Staff",
      Authorizedid: "",
      Authorizedname: "",
      Icnumber: "",
      Authorizedcompany: "",
      Authorizedcompanyaddress: "",
      Vehiclenumber: "",
      popupCompanyNo: "",
      popupCompanyName: "",
      Authorizedcompanyname: "",
      Goodscategory: "Returnable",
      Exitpurpose: "",
      GoodsItem_Qtyunit: "",
      GoodsItem_Serialno: "",
      GoodsItem_Description: "",
      GoodsItem_Qtyreturn: "",
      GoodsItem_Edit_Sequenceno: "",
      GoodsItem_Edit_Qtyunit: "",
      GoodsItem_Edit_Serialno: "",
      GoodsItem_Edit_Description: "",
      GoodsItem_Edit_Qtyreturn: "",
      goodsItemdeleteid: "",
      addAttachments_Filename: "",
      addAttachments_Filetype: "",
      addAttachments_URL: "",
      addAttachments_Remarks: "",
      editAttachemnts_Remarks: "",
      editAttachments_Sequenceno: "",
      editAttachments_Filename: "",
      editAttachments_Filetype: "",
      editAttachments_URL: "",
      attachmentdeletePopup: "",
      ReferencesAdd: "none",
      editReferences_Reflink: "",
      editReferences_Remarks: "",
      editReferences_Sequenceno: "",
      Returndate: new Date(),
      Goodsstatus: "",
      showGoodsItemRequired: "none",
      referencesdeletePopup: false,
      referencesdeleteid: "",
      showAttachedRequired: "none",
      showReferenceRequired: "none",
      isRequesterInformation: "",
      isAuthorizedCarrier: "",
      issaveGoodsCategory: "",
      StaffDetailslistArraySpin: "none",
      companylistArraySpin: "none",
      Exitpurposeremarks: "",
      Goodsstatusremarks: "",
      goodsItemLoader: "No",
      AttachmentsLoader: "No",
      ReferencesLoader: "No",
      Goodsexittimeremarks: ".",
    };
  }

  handleModal(){  
    this.setState({show:!this.state.show})
  }  

  componentDidMount() {
    $('#StafNamePopover').popover({html:true});
    this.props.dispatch({ type: "headerTitle", value: ((this.state.Referenceno) ? "Pending : Edit - " + this.state.Referenceno : "Pending : Edit")});
    this.props.dispatch({ type: 'Referenceno', value: "" })
    this.getStaffName()
    this.getGGPRequest();
    this.GetSectionListData()
    this.GetVehicleListData()
    this.GetTypeOfGoodsListData()
    this.GetExitPurposeListData()
    this.GetAuthCategoryListData()
    this.GetExitTimeListData()
    this.GetStatusofGoodsListData()
  }

  getStaffName = () => {
    let postData = { 
        EmployeeId: this.props.UserId,
        Name: "",
        Section: "",
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
      console.log(data.StaffDetails[0])
      if(data.StaffDetails){
        this.setState({ RequesterId: this.props.UserId, RequesterName: data.StaffDetails[0].Name, RequesterSection: data.StaffDetails[0].Section, RequesterSectionName: data.StaffDetails[0].SectionName, RequesterDepartment: data.StaffDetails[0].Department, RequesterDivision: data.StaffDetails[0].Division, RequesterDesignation: data.StaffDetails[0].Designation, RequesterDisplayName: this.props.UserId +" - "+ data.StaffDetails[0].Name,canStafNamePopover: "flex"})
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
        //console.log("Get GGP Details")
        //console.log(data)
      if(data){
        this.setState({ 
            RequesterId: data.StatffInfo.EmployeeId,
            Description: data.GGPDetails.Description,
            Authorizedcategory: data.GGPDetails.Authorizedcategory,
            Authorizedid: data.GGPDetails.Authorizedid,
            Authorizedname: data.GGPDetails.Authorizedname,
            Icnumber: data.GGPDetails.Icnumber,
            Authorizedcompany: data.GGPDetails.Authorizedcompany,
            Authorizedcompanyname: data.GGPDetails.Authorizedcompany,
            Authorizedcompanyaddress: data.GGPDetails.Authorizedcompanyaddress,
            Vehiclenumber: data.GGPDetails.Vehiclenumber,
            Goodscategory: data.GGPDetails.Goodscategory,
            Exitpurpose: data.GGPDetails.Exitpurpose,
            Exitpurposeremarks: data.GGPDetails.Exitpurposeremarks,
            Goodstype: data.GGPDetails.Goodstype,
            Goodsstatus: data.GGPDetails.Goodsstatus,
            Goodsstatusremarks: data.GGPDetails.Goodsstatusremarks,
            Goodsdestination: data.GGPDetails.Goodsdestination,
            Goodsexittime: data.GGPDetails.Goodsexittime,
            Goodsexittimeremarks: data.GGPDetails.Goodsexittimeremarks,
            Goodscompanyaddress: data.GGPDetails.Goodscompanyaddress,
            GoodsItemslistArray: data.GGPGoodsItemsList,
            AttachmentslistArray: data.AttachmentsList,
            ReferenceLinkslistArray: data.ReferenceLinkList,
            RequesterSection: data.StatffInfo.Section,
            RequesterDepartment:  data.StatffInfo.Department,
            RequesterDivision:  data.StatffInfo.Division,
            RequesterDesignation:  data.StatffInfo.Designation,
        })
        if(data.GGPDetails.Returndate){
            this.setState({ 
                Returndate: data.GGPDetails.Returndate,
            })
        }
        if(data.StatffInfo.EmployeeId){
            this.setState({ 
                RequesterDisplayName: data.StatffInfo.EmployeeId +" - "+data.StatffInfo.Name,
            })
        }
        if(data.GGPDetails.Authorizedid){
            this.setState({ 
                AuthorizedCarrier_AuthorizedName: data.GGPDetails.Authorizedid +" - "+data.GGPDetails.Authorizedname,
            })
        }
      }
    })
  }

  GetSectionListData = () => {
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

  GetVehicleListData = () => {
    // alert('a')
    let postData = { Mode: 'Vehicle' }
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
        this.setState({ VehiclelistArray: data.MasterList })
      }
    })
  }

  GetTypeOfGoodsListData = () =>{
    // alert('a')
    let postData = { Mode: 'GoodsType' }
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
      //console.log("TypeofGoodslistArray")
      //console.log(data)
      if(data){
        this.setState({ TypeofGoodslistArray: data.MasterList })
      }
    })
  }

  GetExitPurposeListData = () =>{
    // alert('a')
    let postData = { Mode: 'ExitPurpose' }
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
      //console.log("ExitPurposelistArray")
      //console.log(data)
      if(data){
        this.setState({ ExitPurposelistArray: data.MasterList })
      }
    })
  }

  GetAuthCategoryListData =() =>{
    // alert('a')
    let postData = { Mode: 'AuthCategory' }
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
      //console.log("AuthCategorylistArray")
      //console.log(data)
      if(data){
        this.setState({ AuthCategorylistArray: data.MasterList })
      }
    })
  }

  GetExitTimeListData = () =>{
    // alert('a')
    let postData = { Mode: 'ExitTime' }
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
      //console.log("ExitTimelistArray")
      //console.log(data)
      if(data){
        this.setState({ ExitTimelistArray: data.MasterList })
      }
    })
  }

  GetStatusofGoodsListData = () => {
    // alert('a')
    let postData = { Mode: 'StatusofGoods' }
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
      //console.log("StatusofGoodslistArray")
      //console.log(data)
      if(data){
        this.setState({ StatusofGoodslistArray: data.MasterList })
      }
    })
  }

  GetGoodsItemsListData = () =>{
    // alert('a')
    //alert(this.state.Referenceno)
    let postData = { Referenceno: this.state.Referenceno }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetGoodsItems', {
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
      //console.log("GoodsItemslistArray")
      //console.log(data)
      if(data){
        this.setState({ GoodsItemslistArray: data.GGPGoodsItemsList })
        this.setState({ goodsItemLoader:"No" })
      }
    })
  }

  GetAttachmentslistData = () =>{
    // alert('a')
    //alert(this.state.Referenceno)
    let postData = { Referenceno: this.state.Referenceno }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetAttachments', {
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
      //console.log("AttachmentslistArray")
      //console.log(data)
      if(data){
        this.setState({ AttachmentslistArray: data.AttachmentsList, AttachmentsLoader: "No" })
      }
    })
  }
  saveasdraf = () =>{
    toast.success("Request saved successfully.", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    this.props.history.push({ pathname: "/pending/list" });
  }

  

  showFirstStaffPopup = () =>{
    this.setState({ getEmployeeFirstShow: true});
  }

  hideFirstStaffPopup = () =>{
    this.setState({ getEmployeeFirstShow: false});
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  showSecondAuthorizedNamePopup = () =>{
    this.setState({ getAuthorizedNameSecondShow: true});
  }

  hideSecondAuthorizedNamePopup = () =>{
    this.setState({ getAuthorizedNameSecondShow: false});
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  showAuthorizedCompanySecondPopup = () =>{
    this.setState({ getAuthorizedCompanySecondShow: true});
  }

  hideAuthorizedCompanySecondPopup = () =>{
    this.setState({ getAuthorizedCompanySecondShow: false});
    this.setState({ popupCompanyNo: "", popupCompanyName: "", companylistArray: [] })
  }

  searchEmployeeClear = () =>{
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [],stafflistArraySpin: "none"  })
  }

  searchCompanyClear = () =>{
    this.setState({ popupCompanyNo: "", popupCompanyName: "", companylistArray: [] })
  }

  getStaffDetails = (id, name, Section, SectionName, Department, Division, Designation) =>{
    this.setState({ RequesterId: id, RequesterName: name, RequesterSection: Section, RequesterSectionName: SectionName, RequesterDepartment: Department, RequesterDivision: Division, RequesterDesignation: Designation, canStafNamePopover: "flex", getEmployeeFirstShow: false, RequesterDisplayName: id +" - "+ name})
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  getAuthorizedNameDetails = (id, name) =>{
    this.setState({ Authorizedid: id, Authorizedname: name, getAuthorizedNameSecondShow: false })
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  getCompanayDetails = (CompanyNo, CompanyName) =>{
    this.setState({ Authorizedcompany: CompanyName, Authorizedcompanyname: CompanyName, getAuthorizedCompanySecondShow: false })
    this.setState({ popupCompanyNo: "", popupCompanyName: "", companylistArray: [] })
  }

  addGoods =() =>{
    this.setState({ GoodsItemAdd: "", showGoodsItemRequired: "none"})
  }
  
  editGoodsItemCancel = () =>{
    this.setState({ goodsItemEdit: false})
  } 

  editGoodsItemshow = (id) =>{
    
    let postData = { 
      Sequenceno: id,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetGoodsItems', {
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
      //console.log('get goods item')
      //console.log(data)
      if(data){
        this.setState({ 
          GoodsItem_Edit_Sequenceno: data.GGPGoodsItemsList[0].Sequenceno,
          GoodsItem_Edit_Qtyunit: data.GGPGoodsItemsList[0].Qtyunit,
          GoodsItem_Edit_Serialno: data.GGPGoodsItemsList[0].Serialno,
          GoodsItem_Edit_Qtyreturn: data.GGPGoodsItemsList[0].Qtyreturn,
          GoodsItem_Edit_Description: data.GGPGoodsItemsList[0].Description,
          goodsItemEdit: true,
        })
      }
    })
  }

  UpdateGoodsItems = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Mode: "Update",
      Sequenceno: this.state.GoodsItem_Edit_Sequenceno,
      Referenceno: this.state.Referenceno,
      Qtyunit: this.state.GoodsItem_Edit_Qtyunit,
      Serialno: this.state.GoodsItem_Edit_Serialno,
      Description: this.state.GoodsItem_Edit_Description,
      Qtyreturn: this.state.GoodsItem_Edit_Qtyreturn,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateGoodsItems', {
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
      //console.log('get goods item')
      //console.log(data)
      if(data){
        this.setState({ 
          GoodsItem_Edit_Sequenceno: "",
          GoodsItem_Edit_Qtyunit: "",
          GoodsItem_Edit_Serialno: "",
          GoodsItem_Edit_Qtyreturn: "",
          GoodsItem_Edit_Description: "",
          goodsItemEdit: false,
        })
        this.GetGoodsItemsListData()
      }
    })
  }

  cancelgoodsItemDelete = () =>{
    this.setState({ goodsItemdeletePopup: false, goodsItemdeleteid: ""})
  }

  cancelattachmentDelete = () =>{
    this.setState({ attachmentdeletePopup: false, goodsItemdeleteid: ""})
  }

  deleteGoodsItem = (id) =>{
    this.setState({ goodsItemdeletePopup: true, goodsItemdeleteid: id})
  }

  deleteAttachment = (id) =>{
    this.setState({ attachmentdeletePopup: true, attachmentdeleteid: id})
  }

  deleteReferences = (id) =>{
    this.setState({ referencesdeletePopup: true, referencesdeleteid: id})
  }

  cancelreferencesDelete = () =>{
    this.setState({ referencesdeletePopup: false, referencesdeleteid: ""})
  }

  confirmgoodsItemDelete = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Mode: "Delete",
      Sequenceno: this.state.goodsItemdeleteid,
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateGoodsItems', {
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
      //console.log('get goods item')
      //console.log(data)
      if(data){
        this.setState({ 
          goodsItemdeleteid: "", goodsItemdeletePopup: false,
        })
        this.GetGoodsItemsListData()
      }
    })
  }

  confirmreferencesDelete = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Mode: "Delete",
      Sequenceno: this.state.referencesdeleteid,
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateReferenceLink', {
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
      //console.log('get goods item')
      //console.log(data)
      if(data){
        this.setState({ 
          referencesdeleteid: "", referencesdeletePopup: false,
        })
        this.GetReferenceLinkslistData()
      }
    })
  }

  addAttachments = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
        Mode: "Add",
        Sequenceno: "",
        Referenceno: this.state.Referenceno,
        Filename: "Test.txt", //addAttachments_Filename
        Filetype :"txt", //addAttachments_Filetype
        URL: "/GGP2021000001/Test.txt", //addAttachments_URL
        Remarks: 1, //addAttachments_Remarks
        Createdby: this.props.UserId

    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateAttachments', {
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
        this.setState({ GoodsItem_Qtyunit:"", GoodsItem_Serialno: "", GoodsItem_Description: "", GoodsItem_Qtyreturn: "", GoodsItemAdd: "none" })
        this.GetAttachmentslistData()
      }
    })
  }
  
  handleChange = (e) => {
    // alert(e.target.id)
    // alert(e.target.value)
    // alert(e.target.name)
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
      case "Description":
        this.setState({ Description: e.target.value })
        break; 
      case "Authorizedcategory":
        this.setState({ Authorizedcategory: e.target.value, Authorizedid:"" , Authorizedname:"" })        
        break; 
      case "Icnumber":
        this.setState({ Icnumber: e.target.value })
        break;
      case "Authorizedcompany":
        this.setState({ Authorizedcompany: e.target.value })
        break;
      case "Authorizedcompanyaddress":
        this.setState({ Authorizedcompanyaddress: e.target.value })
        break;
      case "Vehiclenumber":
        this.setState({ Vehiclenumber: e.target.value })
        break;
      case "popupCompanyNo":
        this.setState({ popupCompanyNo: e.target.value })
        break;
      case "popupCompanyName":
        this.setState({ popupCompanyName: e.target.value })
        break;
      case "Returnable":
        this.setState({ Goodscategory: e.target.value })
        break;
      case "Non-Returnable":
        this.setState({ Goodscategory: e.target.value })
        break;
      case "Exitpurpose":
        this.setState({ Exitpurpose: e.target.value })
        break;
      case "StatusofGoods":
        this.setState({ StatusofGoods: e.target.value })
        break;
      case "GoodsItem_Qtyunit":
        const GoodsItem_Qtyunit = (e.target.validity.valid) ? e.target.value : this.state.GoodsItem_Qtyunit;
        this.setState({ GoodsItem_Qtyunit: GoodsItem_Qtyunit })
        break;
      case "GoodsItem_Serialno":
        this.setState({ GoodsItem_Serialno: e.target.value })
        break;
      case "GoodsItem_Description":
        this.setState({ GoodsItem_Description: e.target.value })
        break;
      case "GoodsItem_Qtyreturn":
        this.setState({ GoodsItem_Qtyreturn: e.target.value })
        break;
      case "GoodsItem_Edit_Qtyunit":
        const GoodsItem_Edit_Qtyunit = (e.target.validity.valid) ? e.target.value : this.state.GoodsItem_Edit_Qtyunit;
        this.setState({ GoodsItem_Edit_Qtyunit: GoodsItem_Edit_Qtyunit })
        break;
      case "GoodsItem_Edit_Serialno":
        this.setState({ GoodsItem_Edit_Serialno: e.target.value })
        break;
      case "GoodsItem_Edit_Qtyreturn":
        this.setState({ GoodsItem_Edit_Qtyreturn: e.target.value })
        break;
      case "GoodsItem_Edit_Description":
        this.setState({ GoodsItem_Edit_Description: e.target.value })
        break;
      case "editAttachments_Remarks":
        this.setState({ editAttachments_Remarks: e.target.value })
        break;
      case "References_Reflink":
        this.setState({ References_Reflink: e.target.value })
        break;
      case "References_Remarks":
        this.setState({ References_Remarks: e.target.value })
        break;
      case "editReferences_Reflink":
        this.setState({ editReferences_Reflink: e.target.value })
        break;
      case "editReferences_Remarks":
        this.setState({ editReferences_Remarks: e.target.value })
        break;
      case "Goodscompanyaddress":
        this.setState({ Goodscompanyaddress: e.target.value })
        break;
      case "Goodstype":
        this.setState({ Goodstype: e.target.value })
        break;
      case "Goodsdestination":
        this.setState({ Goodsdestination: e.target.value })
        break;
      case "Goodsexittime":
        this.setState({ Goodsexittime: e.target.value })
        if(e.target.value === "Office Hour"){
          this.setState({ Goodsexittimeremarks: "." })
        }else{
          this.setState({ Goodsexittimeremarks: "" })
        }
        break; 
      case "Goodsexittimeremarks":
        this.setState({ Goodsexittimeremarks: e.target.value })
        break;
      case "Exitpurposeremarks":
        this.setState({ Exitpurposeremarks: e.target.value })
        break;
      case "Goodsstatusremarks":
        this.setState({ Goodsstatusremarks: e.target.value })
        break;
        case "Authorizedname":
        this.setState({ Authorizedname: e.target.value })
        break;
      default: break;
      }
  }

  Returndate = date => {
    this.setState({ Returndate: date })
  };

  handleGoodsstatus = (value) =>{
    this.setState({ Goodsstatus: value })
  }

  handleSelectFormFields = selectedOption => {
  //  alert(selectedOption.id)
  //  alert(selectedOption.value)
    switch (selectedOption.id) {
      case "popupSection":
        // alert(selectedOption.value)
        this.setState({ popupSection: selectedOption.value })
        break;
      default: break;
    }
  }

  searchEmployee = () => {
    this.setState({ StaffDetailslistArraySpin: "" })
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
        this.setState({ StaffDetailslistArray: data.StaffDetails })
        this.setState({ StaffDetailslistArraySpin: "none" })
      }
    })
  }

  searchCompany = () => {
    // alert('a')
    this.setState({ companylistArraySpin: "" })
    let postData = { 
      CompanyNo: this.state.popupCompanyNo,
      CompanyName: this.state.popupCompanyName,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetCompanyList', {
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
        this.setState({ companylistArray: data.CompanyList })
        this.setState({ companylistArraySpin: "none" })
      }
    })
  }

  saveGoodsItem = () =>{
    
    if (this.state.Goodscategory === "Returnable") {
      if (this.validator5_2.allValid()) {
        this.setState({ goodsItemLoader:"Yes" })
        let postData = { 
            Mode: "Add",
            Sequenceno: "",
            Referenceno: this.state.Referenceno,
            Qtyunit: this.state.GoodsItem_Qtyunit,
            Serialno: this.state.GoodsItem_Serialno,
            Description: this.state.GoodsItem_Description,
            Qtyreturn: this.state.GoodsItem_Qtyreturn,
        }
        fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateGoodsItems', {
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
            this.setState({ GoodsItem_Qtyunit:"", GoodsItem_Serialno: "", GoodsItem_Description: "", GoodsItem_Qtyreturn: "", GoodsItemAdd: "none" })
            this.GetGoodsItemsListData()
          }
        })
      } else {
        this.validator5_2.showMessages();
        this.forceUpdate();
      }
    }else{
      if (this.validator5.allValid()) {
        this.setState({ goodsItemLoader:"Yes" })
        let postData = { 
            Mode: "Add",
            Sequenceno: "",
            Referenceno: this.state.Referenceno,
            Qtyunit: this.state.GoodsItem_Qtyunit,
            Serialno: this.state.GoodsItem_Serialno,
            Description: this.state.GoodsItem_Description,
            Qtyreturn: this.state.GoodsItem_Qtyreturn,
        }
        fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateGoodsItems', {
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
            this.setState({ GoodsItem_Qtyunit:"", GoodsItem_Serialno: "", GoodsItem_Description: "", GoodsItem_Qtyreturn: "", GoodsItemAdd: "none" })
            this.GetGoodsItemsListData()
          }
        })
      } else {
        this.validator5.showMessages();
        this.forceUpdate();
      }
   }
  }

  removeGoodsItem = () =>{
    this.setState({ GoodsItem_Qtyunit:"", GoodsItem_Serialno: "", GoodsItem_Description: "", GoodsItem_Qtyreturn: "", GoodsItemAdd: "none" })
  }
  
  editAttachmentsShow = (Sequenceno, Filename, Filetype, Remarks, URL) =>{
    //alert(Remarks)
    this.setState({ editAttachments:true,  editAttachments_Sequenceno: Sequenceno, editAttachments_Filename: Filename, editAttachments_Filetype: Filetype, editAttachments_Remarks: Remarks, editAttachments_URL: URL})
  }

  editAttachmentsHide = () =>{
    this.setState({ editAttachments:false,  editAttachments_Sequenceno: "", editAttachments_Filename: "", editAttachments_Filetype: "", editAttachments_Remarks: "", editAttachments_URL: ""})
  }

  UpdateAttachments = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
        Mode: "Update",
        Sequenceno: this.state.editAttachments_Sequenceno,  
        Referenceno: this.state.Referenceno,              
        Filename: this.state.editAttachments_Filename,
        Filetype: this.state.editAttachments_Filetype,
        URL: this.state.editAttachments_URL,
        Remarks: this.state.editAttachments_Remarks,
        Createdby: this.props.UserId,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateAttachments', {
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
        this.setState({ editAttachments:false, editAttachments_Sequenceno: "", editAttachments_Filename: "",  editAttachments_Filetype: "", editAttachments_URL: "",  editAttachments_Remarks: ""});
        this.GetAttachmentslistData();
      }
    })
  }

  deleteAttachment = (id) =>{
    this.setState({ attachmentdeletePopup: true, attachmentdeleteid: id})
  }

  confirmattachmentDelete = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Mode: "Delete",
      Sequenceno: this.state.attachmentdeleteid,
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateAttachments', {
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
      //console.log('Delete Attached')
      //console.log(data)
      if(data){
        this.setState({ 
          attachmentdeleteid: "", attachmentdeletePopup: false,
        })
        this.GetAttachmentslistData()
      }
    })
  }

  addReferences = () =>{
    this.setState({ ReferencesAdd: "", showReferenceRequired: "none"})
  }

  References_Cancel = () =>{
    this.setState({ ReferencesAdd: "none", References_Reflink: "", References_Remarks: ""})
  }

  editReferencesHide = () =>{
    this.setState({ editReferences: false})
  }

  editReferencesShow = (Sequenceno, Reflink, Remarks) =>{
    this.setState({ editReferences: true, editReferences_Sequenceno: Sequenceno, editReferences_Reflink: Reflink, editReferences_Remarks: Remarks})
  }

  editReferencesHide = () =>{
    this.setState({ editReferences: false, editReferences_Reflink: "", editReferences_Remarks: ""})
  }

  References_Save = () =>{
    //alert(this.state.Referenceno)
    this.setState({ ReferencesLoader: "Yes" })
    let postData = { 
      Mode: "Add",
      Sequenceno: "",
      Referenceno: this.state.Referenceno,
      Reflink: this.state.References_Reflink,
      Remarks: this.state.References_Remarks,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateReferenceLink', {
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
      //console.log('Reference Add')
      //console.log(data)
      if(data){
        this.setState({ 
          References_Reflink: "", References_Remarks: "", ReferencesAdd: "none", showReferenceRequired: "none"
        })
        this.GetReferenceLinkslistData()
      }
    })
  }

  GetReferenceLinkslistData = () =>{
    //alert(this.state.Referenceno)
    // alert('a')
    let postData = { 
      Sequenceno: "",
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetReferenceLinks', {
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
      //console.log("ReferenceLinkslistArray")
      //console.log(data)
      if(data){
        this.setState({ ReferenceLinkslistArray: data.ReferenceLinkList, ReferencesLoader: "No" })
      }
    })
  }

  UpdateReferences = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Mode: "Update",
      Sequenceno: this.state.editReferences_Sequenceno,
      Referenceno: this.state.Referenceno,
      Reflink: this.state.editReferences_Reflink,
      Remarks: this.state.editReferences_Remarks,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateReferenceLink', {
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
      //console.log("ReferenceLinkslistArray")
      //console.log(data)
      if(data){
        this.setState({ editReferences: false, editReferences_Reflink: "", editReferences_Remarks: ""})
        this.GetReferenceLinkslistData()
      }
    })
  }

  saveRequesterInformation =() =>{
    //   alert(this.state.Referenceno)
    let postData = { 
      Referenceno: this.state.Referenceno,
      Description: this.state.Description,
    }
    //console.log(postData)
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/UpdateRequesterInfo', {
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
      //console.log("Updated Requester Information")
      //console.log(data)
      if(data){
        this.props.dispatch({ type: 'Referenceno', value: data.Referenceno })
        this.setState({ isRequesterInformation: "yes" })
      }
    })
  }

  saveAuthorizedCarrier = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Referenceno: this.state.Referenceno,
      Authorizedcategory: this.state.Authorizedcategory,
      Authorizedid: this.state.Authorizedid,
      Authorizedname: this.state.Authorizedname,
      Icnumber: this.state.Icnumber,
      Authorizedcompany: this.state.Authorizedcompany,
      Authorizedcompanyaddress: this.state.Authorizedcompanyaddress,
      Vehiclenumber: this.state.Vehiclenumber,
    }
    //console.log(postData)
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/UpdateAuthorizedCarrier', {
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
      //console.log("Save Authorized Carrier")
      //console.log(data)
      if(data){
        this.setState({ isAuthorizedCarrier: "yes" })
      }
    })
  }

  saveGoodsCategory = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Referenceno: this.state.Referenceno,
      Goodscategory: this.state.Goodscategory,
      Exitpurpose: this.state.Exitpurpose,
      Exitpurposeremarks: this.state.Exitpurposeremarks,
      Returndate: moment(this.state.Returndate).format("yyyy-MM-DD") + "T18:30:00.000Z",
      Goodstype: this.state.Goodstype,
      Goodsstatus: this.state.Goodsstatus,
      Goodsstatusremarks: this.state.Goodsstatusremarks,
      Goodsdestination: this.state.Goodsdestination,
      Goodsexittime: this.state.Goodsexittime,
      Goodsexittimeremarks: this.state.Goodsexittimeremarks,
      Goodscompanyaddress: this.state.Goodscompanyaddress,
      UserId: this.props.UserId,
    }
    console.log(postData)
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/UpdateGoodsCategory', {
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
      //console.log("Save Goods Category")
      //console.log(data)
      if(data){
        this.setState({ issaveGoodsCategory: "yes" })
      }
    })
  }

  saveDraftRequesterInformation =() =>{
    //   alert(this.state.Referenceno)
    let postData = { 
        Referenceno: this.state.Referenceno,
        Description: this.state.Description,
    }
    //console.log(postData)
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/UpdateRequesterInfo', {
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
    //console.log("Updated Requester Information")
    //console.log(data)
    if(data){
        this.props.dispatch({ type: 'Referenceno', value: data.Referenceno })
        this.setState({ isRequesterInformation: "yes" })
        this.setState({ issaveGoodsCategory: "yes" })
        toast.success("Request successfully saved as a draft.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.props.history.push({ pathname: "/pending/list" });
    }
    })
  }

  saveDraftAuthorizedCarrier = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Referenceno: this.state.Referenceno,
      Authorizedcategory: this.state.Authorizedcategory,
      Authorizedid: this.state.Authorizedid,
      Authorizedname: this.state.Authorizedname,
      Icnumber: this.state.Icnumber,
      Authorizedcompany: this.state.Authorizedcompany,
      Authorizedcompanyaddress: this.state.Authorizedcompanyaddress,
      Vehiclenumber: this.state.Vehiclenumber,
    }
    //console.log(postData)
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/UpdateAuthorizedCarrier', {
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
      //console.log("Save Authorized Carrier")
      //console.log(data)
      if(data){
        this.setState({ isAuthorizedCarrier: "yes" })
        toast.success("Request successfully saved as a draft.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.props.history.push({ pathname: "/pending/list" });
      }
    })
  }

  saveDraftGoodsCategory = () =>{
    //alert(this.state.Referenceno)
    let postData = { 
      Referenceno: this.state.Referenceno,
      Goodscategory: this.state.Goodscategory,
      Exitpurpose: this.state.Exitpurpose,
      Exitpurposeremarks: this.state.Exitpurposeremarks,
      Returndate: moment(this.state.Returndate).format("yyyy-MM-DD") + "T18:30:00.000Z",
      Goodstype: this.state.Goodstype,
      Goodsstatus: this.state.Goodsstatus,
      Goodsstatusremarks: this.state.Goodsstatusremarks,
      Goodsdestination: this.state.Goodsdestination,
      Goodsexittime: this.state.Goodsexittime,
      Goodsexittimeremarks: this.state.Goodsexittimeremarks,
      Goodscompanyaddress: this.state.Goodscompanyaddress,
      UserId: this.props.UserId,
    }
    //console.log(postData)
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/UpdateGoodsCategory', {
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
      //console.log("Save Goods Category")
      //console.log(data)
      if(data){
        this.setState({ issaveGoodsCategory: "yes" })
        toast.success("Request successfully saved as a draft.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.props.history.push({ pathname: "/pending/list" });
      }
    })
  }

  formNext = value => {
    // alert(value)
    switch (value) {      
      case 1:
        if (this.validator1.allValid()) {
          this.saveRequesterInformation();
          this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
        } else {
          this.validator1.showMessages();
          this.forceUpdate();
        }
        break;
      case 2:
        if (this.validator1.allValid()) {
          if (this.state.Authorizedcategory === "MMHE Staff") {
            if (this.validator2_1.allValid()) {
              this.saveAuthorizedCarrier();
              this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
              break;
            } else {
              this.validator2_1.showMessages();
              this.forceUpdate();
              break;
            }
          } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
            if (this.validator2_2.allValid()) {
              this.saveAuthorizedCarrier();
              this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
              break;
            } else {
              this.validator2_2.showMessages();
              this.forceUpdate();
              break;
            }
          } else {
            if (this.validator2_3.allValid()) {
              this.saveAuthorizedCarrier();
              this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
              break;
            } else {
              this.validator2_3.showMessages();
              this.forceUpdate();
              break;
            }
          }
        } else {
          this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
          this.validator1.showMessages();
          this.forceUpdate();
          break;
        }
      case 3:
        if (this.validator1.allValid()) {
          if (this.state.Authorizedcategory === "MMHE Staff") {
            if (this.validator2_1.allValid()) {
              if (this.validator3.allValid()) {
                this.saveGoodsCategory();
                this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4});
                break;
              } else {
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_1.showMessages();
              this.forceUpdate();
              break;
            }
          } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
            if (this.validator2_2.allValid()) {
              if (this.validator3.allValid()) {
                this.saveGoodsCategory();
                this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4});
                break;
              } else {
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_2.showMessages();
              this.forceUpdate();
              break;
            }
          } else {
            if (this.validator2_3.allValid()) {
              if (this.validator3.allValid()) {
                this.saveGoodsCategory();
                this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4});
                break;
              } else {
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_3.showMessages();
              this.forceUpdate();
              break;
            }
          }
        } else {
          this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
          this.validator1.showMessages();
          this.forceUpdate();
          break;
        }
      case 4:

        if (this.validator1.allValid()) {
          if (this.state.Authorizedcategory === "MMHE Staff") {
            if (this.validator2_1.allValid()) {
              if (this.validator3.allValid()) {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  this.setState({ showGoodsItemRequired: "block"});
                  break;
                }else{
                  this.setState({ step1: "none",step2: "none",step3: "none",step4: "none",step5: "block", stepbarballon: 5});
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_1.showMessages();
              this.forceUpdate();
              break;
            }
          } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
            if (this.validator2_2.allValid()) {
              if (this.validator3.allValid()) {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  this.setState({ showGoodsItemRequired: "block"});
                  break;
                }else{
                  this.setState({ step1: "none",step2: "none",step3: "none",step4: "none",step5: "block", stepbarballon: 5});
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_2.showMessages();
              this.forceUpdate();
              break;
            }
          } else {
            if (this.validator2_3.allValid()) {
              if (this.validator3.allValid()) {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  this.setState({ showGoodsItemRequired: "block"});
                  break;
                }else{
                  this.setState({ step1: "none",step2: "none",step3: "none",step4: "none",step5: "block", stepbarballon: 5});
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_3.showMessages();
              this.forceUpdate();
              break;
            }
          }
        } else {
          this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
          this.validator1.showMessages();
          this.forceUpdate();
          break;
        }
      default:
        break;
    }
  }

  saveDraft = value => {
    switch (value) {      
      case 1:
        if (this.validator1.allValid()) {
          this.saveDraftRequesterInformation();
          break;
        } else {
          this.validator1.showMessages();
          this.forceUpdate();
        }
        break;
      case 2:
        if (this.validator1.allValid()) {
          if (this.state.Authorizedcategory === "MMHE Staff") {
            if (this.validator2_1.allValid()) {
              this.saveDraftAuthorizedCarrier();
              break;
            } else {
              this.validator2_1.showMessages();
              this.forceUpdate();
              break;
            }
          } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
            if (this.validator2_2.allValid()) {
              this.saveDraftAuthorizedCarrier();
              break;
            } else {
              this.validator2_2.showMessages();
              this.forceUpdate();
              break;
            }
          } else {
            if (this.validator2_3.allValid()) {
              this.saveDraftAuthorizedCarrier();
              break;
            } else {
              this.validator2_3.showMessages();
              this.forceUpdate();
              break;
            }
          }
        } else {
          this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
          this.validator1.showMessages();
          this.forceUpdate();
          break;
        }
      case 3:
        if (this.validator1.allValid()) {
          if (this.state.Authorizedcategory === "MMHE Staff") {
            if (this.validator2_1.allValid()) {
              if (this.validator3.allValid()) {
                this.saveDraftGoodsCategory();
                break;
              } else {
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_1.showMessages();
              this.forceUpdate();
              break;
            }
          } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
            if (this.validator2_2.allValid()) {
              if (this.validator3.allValid()) {
                this.saveDraftGoodsCategory();
                break;
              } else {
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_2.showMessages();
              this.forceUpdate();
              break;
            }
          } else {
            if (this.validator2_3.allValid()) {
              if (this.validator3.allValid()) {
                this.saveDraftGoodsCategory();
                break;
              } else {
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_3.showMessages();
              this.forceUpdate();
              break;
            }
          }
        } else {
          this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
          this.validator1.showMessages();
          this.forceUpdate();
          break;
        }
      case 4:

        if (this.validator1.allValid()) {
          if (this.state.Authorizedcategory === "MMHE Staff") {
            if (this.validator2_1.allValid()) {
              if (this.validator3.allValid()) {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  this.setState({ showGoodsItemRequired: "block"});
                  break;
                }else{
                  toast.success("Request successfully saved as a draft.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                  });
                  this.props.history.push({ pathname: "/pending/list" });
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_1.showMessages();
              this.forceUpdate();
              break;
            }
          } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
            if (this.validator2_2.allValid()) {
              if (this.validator3.allValid()) {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  this.setState({ showGoodsItemRequired: "block"});
                  break;
                }else{
                  toast.success("Request successfully saved as a draft.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                  });
                  this.props.history.push({ pathname: "/pending/list" });
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_2.showMessages();
              this.forceUpdate();
              break;
            }
          } else {
            if (this.validator2_3.allValid()) {
              if (this.validator3.allValid()) {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  this.setState({ showGoodsItemRequired: "block"});
                  break;
                }else{
                  toast.success("Request successfully saved as a draft.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                  });
                  this.props.history.push({ pathname: "/pending/list" });
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                this.validator3.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
              this.validator2_3.showMessages();
              this.forceUpdate();
              break;
            }
          }
        } else {
          this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
          this.validator1.showMessages();
          this.forceUpdate();
          break;
        }
        case 5:
          if (this.validator1.allValid()) {
            if (this.state.Authorizedcategory === "MMHE Staff") {
              if (this.validator2_1.allValid()) {
                if (this.validator3.allValid()) {
                  if (this.state.GoodsItemslistArray.length <= 0) {
                    this.setState({ showGoodsItemRequired: "block"});
                    break;
                  }else{
                    if(this.state.AttachmentslistArray.length <= 0){
                      this.setState({ showAttachedRequired: ""});
                    }else{
                      this.setState({ showAttachedRequired: "none"});
                    }
                    
                    // if(this.state.ReferenceLinkslistArray.length <= 0){
                    //   this.setState({ showReferenceRequired: ""});
                    // }else{
                    //   this.setState({ showReferenceRequired: "none"});
                    // }
                
                    if(this.state.AttachmentslistArray.length > 0 ){
                      toast.success("Request successfully saved as a draft.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                      });
                      this.props.history.push({ pathname: "/dashboard" });
                    }
                    break;
                  }
                } else {
                  this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                  this.validator3.showMessages();
                  this.forceUpdate();
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
                this.validator2_1.showMessages();
                this.forceUpdate();
                break;
              }
            } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
              if (this.validator2_2.allValid()) {
                if (this.validator3.allValid()) {
                  if (this.state.GoodsItemslistArray.length <= 0) {
                    this.setState({ showGoodsItemRequired: "block"});
                    break;
                  }else{
                    if(this.state.AttachmentslistArray.length <= 0){
                      this.setState({ showAttachedRequired: ""});
                    }else{
                      this.setState({ showAttachedRequired: "none"});
                    }
                    
                    // if(this.state.ReferenceLinkslistArray.length <= 0){
                    //   this.setState({ showReferenceRequired: ""});
                    // }else{
                    //   this.setState({ showReferenceRequired: "none"});
                    // }
                
                    if(this.state.AttachmentslistArray.length > 0 ){
                      toast.success("Request successfully saved as a draft.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                      });
                      this.props.history.push({ pathname: "/dashboard" });
                    }
                    break;
                  }
                } else {
                  this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                  this.validator3.showMessages();
                  this.forceUpdate();
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
                this.validator2_2.showMessages();
                this.forceUpdate();
                break;
              }
            } else {
              if (this.validator2_3.allValid()) {
                if (this.validator3.allValid()) {
                  if (this.state.GoodsItemslistArray.length <= 0) {
                    this.setState({ showGoodsItemRequired: "block"});
                    break;
                  }else{
                    if(this.state.AttachmentslistArray.length <= 0){
                      this.setState({ showAttachedRequired: ""});
                    }else{
                      this.setState({ showAttachedRequired: "none"});
                    }
                    
                    // if(this.state.ReferenceLinkslistArray.length <= 0){
                    //   this.setState({ showReferenceRequired: ""});
                    // }else{
                    //   this.setState({ showReferenceRequired: "none"});
                    // }
                
                    if(this.state.AttachmentslistArray.length > 0 ){
                      toast.success("Request successfully saved as a draft.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                      });
                      this.props.history.push({ pathname: "/dashboard" });
                    }
                    break;
                  }
                } else {
                  this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
                  this.validator3.showMessages();
                  this.forceUpdate();
                  break;
                }
              } else {
                this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
                this.validator2_3.showMessages();
                this.forceUpdate();
                break;
              }
            }
          } else {
            this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
            this.validator1.showMessages();
            this.forceUpdate();
            break;
          }
      default:
        break;
    }
  }

  formprevious = value => {
    switch (value) {      
      case 2:
        this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
        break;
      case 3:
        this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
        break;
      case 4:
        this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
        break;
      case 5:
        this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4});
        break;
      default:
        break;
    }
  }

  progressSetps = value =>{
    switch (value) {      
      case 1:

        this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
        break;
      case 2:
        this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
        break;
      case 3:
        this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
        break;
      case 4:
        this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4});
        break;
      case 5:
        this.setState({ step1: "none",step2: "none",step3: "none",step4: "none",step5: "block", stepbarballon: 5});
        break;
      default:
        break;
    }
  }

  saveCreateRequest = () =>{
    var CryptoJS = require("crypto-js");

    if (this.validator1.allValid()) {
      if (this.state.Authorizedcategory === "MMHE Staff") {
        if (this.validator2_1.allValid()) {
          if (this.validator3.allValid()) {
            if (this.state.GoodsItemslistArray.length >= 1) {
              if(this.state.AttachmentslistArray.length <= 0){
                this.setState({ showAttachedRequired: ""});
              }else{
                this.setState({ showAttachedRequired: "none"});
              }
              
              // if(this.state.ReferenceLinkslistArray.length <= 0){
              //   this.setState({ showReferenceRequired: ""});
              // }else{
              //   this.setState({ showReferenceRequired: "none"});
              // }
          
              if(this.state.AttachmentslistArray.length > 0){
                //alert(this.state.Referenceno)

                if(!this.state.isRequesterInformation){
                  this.saveRequesterInformation();
                }
                if(!this.state.isAuthorizedCarrier){
                  this.saveAuthorizedCarrier();
                }
                if(!this.state.issaveGoodsCategory){
                  this.saveGoodsCategory();
                }

                window.location = process.env.REACT_APP_ENV +"/pending/aprroverlist?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(this.state.Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
              }
            }else{
              this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4, showGoodsItemRequired: ""});
            }
          } else {
            this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
            this.validator3.showMessages();
            this.forceUpdate();
          }
        } else {
          this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
          this.validator2_1.showMessages();
          this.forceUpdate();
        }
      } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
        if (this.validator2_2.allValid()) {
          if (this.validator3.allValid()) {
            if (this.state.GoodsItemslistArray.length >= 1) {
              if(this.state.AttachmentslistArray.length <= 0){
                this.setState({ showAttachedRequired: ""});
              }else{
                this.setState({ showAttachedRequired: "none"});
              }
              
              // if(this.state.ReferenceLinkslistArray.length <= 0){
              //   this.setState({ showReferenceRequired: ""});
              // }else{
              //   this.setState({ showReferenceRequired: "none"});
              // }
          
              if(this.state.AttachmentslistArray.length > 0){
                //alert(this.state.Referenceno)
                if(!this.state.isRequesterInformation){
                  this.saveRequesterInformation();
                }
                if(!this.state.isAuthorizedCarrier){
                  this.saveAuthorizedCarrier();
                }
                if(!this.state.issaveGoodsCategory){
                  this.saveGoodsCategory();
                }

                window.location = process.env.REACT_APP_ENV +"/pending/aprroverlist?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(this.state.Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
              }
            }else{
              this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4, showGoodsItemRequired: ""});
            }
          } else {
            this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
            this.validator3.showMessages();
            this.forceUpdate();
          }
        } else {
          this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
          this.validator2_2.showMessages();
          this.forceUpdate();
        }
      } else {
        if (this.validator2_3.allValid()) {
          if (this.validator3.allValid()) {
            if (this.state.GoodsItemslistArray.length >= 1) {
              if(this.state.AttachmentslistArray.length <= 0){
                this.setState({ showAttachedRequired: ""});
              }else{
                this.setState({ showAttachedRequired: "none"});
              }
              
              // if(this.state.ReferenceLinkslistArray.length <= 0){
              //   this.setState({ showReferenceRequired: ""});
              // }else{
              //   this.setState({ showReferenceRequired: "none"});
              // }
          
              if(this.state.AttachmentslistArray.length > 0 ){
                //alert(this.state.Referenceno)
                if(!this.state.isRequesterInformation){
                  this.saveRequesterInformation();
                }
                if(!this.state.isAuthorizedCarrier){
                  this.saveAuthorizedCarrier();
                }
                if(!this.state.issaveGoodsCategory){
                  this.saveGoodsCategory();
                }

                window.location = process.env.REACT_APP_ENV +"/pending/aprroverlist?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(this.state.Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
              }
            }else{
              this.setState({ step1: "none",step2: "none",step3: "none",step4: "block",step5: "none", stepbarballon: 4, showGoodsItemRequired: ""});
            }
          } else {
            this.setState({ step1: "none",step2: "none",step3: "block",step4: "none",step5: "none", stepbarballon: 3});
            this.validator3.showMessages();
            this.forceUpdate();
          }
        } else {
          this.setState({ step1: "none",step2: "block",step3: "none",step4: "none",step5: "none", stepbarballon: 2});
          this.validator2_3.showMessages();
          this.forceUpdate();
        }
      }
    } else {
      this.setState({ step1: "block",step2: "none",step3: "none",step4: "none",step5: "none", stepbarballon: 1});
      this.validator1.showMessages();
      this.forceUpdate();
    }
  }

  onDrop = (acceptedFiles) => {
    this.setState({ showAttachedRequired: "none", AttachmentsLoader: "Yes"});
    acceptedFiles.map(file => {
      //console.log(file)
    //   let data = new FormData();
    //   data.append('file', file);
    //   data.append('ReferenceNo', this.state.Referenceno);
    //   data.append('UserId', this.props.UserId);
    //   data.append('Mode', "Add");
    //   data.append('Remarks', "");
    //   data.append('Sequenceno', "0");
    //   $.ajax({
    //       type: "POST",
    //       url: process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/Post',
    //       data: data,
    //       dataType: "JSON",
    //       processData: false,
    //       contentType: false,
    //       crossDomain: true,
    //       headers: {  
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    //         },
    //   }).done(function(json){
    //   });
      
    // })
   
    //alert(this.state.Referenceno)
      let data = new FormData();
      data.append('file', file);
      data.append('ReferenceNo', this.state.Referenceno);
      data.append('UserId', this.props.UserId);
      data.append('Mode', "Add");
      data.append('Remarks', "");
      data.append('Sequenceno', "0");
      fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/Post', {
      method: 'POST',
      processData: false,
      contentType: false,
      crossDomain: true,
      headers: {  
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        },
      body: data
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
          this.GetAttachmentslistData();
        }
      }) 

      }) 


  }

  getVehiclenumber = (val) =>{
    this.setState({ Vehiclenumber: val })
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.searchEmployee()
    }
  }
  _handleKeyDownCompany = (e) => {
    if (e.key === 'Enter') {
      this.searchCompany()
    }
  }

  render() {
    let sectionOptionList = [];
    if(this.state.SectionlistArray.length > 0){
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
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/pending/list"}>My Application : Pending List</Breadcrumb.Item>
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        </Breadcrumb>
        <ul id="progressbar">
          <li id="req-info" className={((this.state.stepbarballon === 1) ? 'active' : '') + ((this.state.stepbarballon > 1) ? 'selectedBar' : '')} onClick={() => this.progressSetps(1)}>
            <strong className={((this.state.stepbarballon === 1) ? 'active-text' : '') + ((this.state.stepbarballon > 1) ? 'selected-text' : '')}>Requester Information</strong>
          </li>
          <li id="auth-career" className={((this.state.stepbarballon === 2) ? 'active' : '') + ((this.state.stepbarballon > 2) ? 'selectedBar' : '')} onClick={() => this.progressSetps(2)}>
            <strong className={((this.state.stepbarballon === 2) ? 'active-text' : '') + ((this.state.stepbarballon > 2) ? 'selected-text' : '')}>Authorized Carrier</strong>
          </li>
          <li id="goods-cat" className={((this.state.stepbarballon === 3) ? 'active' : '') + ((this.state.stepbarballon > 3) ? 'selectedBar' : '')} onClick={() => this.progressSetps(3)}>
            <strong className={((this.state.stepbarballon === 3) ? 'active-text' : '') + ((this.state.stepbarballon > 3) ? 'selected-text' : '')}>Goods Category</strong>
          </li>
          <li id="goods-item" className={((this.state.stepbarballon === 4) ? 'active' : '') + ((this.state.stepbarballon > 4) ? 'selectedBar' : '')} onClick={() => this.progressSetps(4)}>
            <strong className={((this.state.stepbarballon === 4) ? 'active-text' : '') + ((this.state.stepbarballon > 4) ? 'selected-text' : '')}>Goods Item</strong>
          </li>
          <li id="attachments" className={((this.state.stepbarballon === 5) ? 'active' : '')} onClick={() => this.progressSetps(5)}>
            <strong className={((this.state.stepbarballon === 5) ? 'active-text' : '')}>Attachments</strong>
          </li>
        </ul>
        <div className="content-area shadow p-3 mb-5 bg-white rounded">

          {/* Step 1 */}

          <section style={{display: this.state.step1 }} className="p-3">
            <h2 className="fs-title mb-2 mb-sm-4">Requester Information</h2>
            <p className="ref-no d-block d-sm-none"> {this.state.Referenceno} </p>
            <div className="form-group row">
              <label for="" className="col-sm-2 col-form-label text-muted">
                Staff No / Name *
              </label>
              <div className="col-sm-4">
                <div className="input-group mb-2 mr-sm-2" >
                  <input type="text" className="form-control" id="" placeholder="" readOnly={true} value={this.state.RequesterDisplayName} onClick={this.showFirstStaffPopup}/>
                  <div className="input-group-prepend" >
                  </div>
                  <div className="input-group-prepend ml-3">
                  <button
                      id="PopoverLegacy"
                      className="input-group-text"
                      type="button"
                      data-toggle="popover"
                      data-placement="bottom"
                    >
                      <i className="fa fa-info text-muted"> </i>
                    </button>
                  </div>
                </div>
                {
                  this.validator1.message('Staff No / Name', this.state.RequesterDisplayName, 'required')
                }
                <UncontrolledPopover trigger="legacy" placement="bottom" target="PopoverLegacy">
                <PopoverHeader></PopoverHeader>
                <PopoverBody>
                <div class="pop">
                  <div class="row">
                    <div class="col-xs-4 col-md-4">Section</div>
                    <div class="col-xs-8 col-md-8">: {this.state.RequesterSection}</div>
                  </div>
                  <div class="row">
                    <div class="col-xs-4 col-md-4">Department</div>
                    <div class="col-xs-8 col-md-8">: {this.state.RequesterDepartment}</div>
                  </div>
                  <div class="row">
                    <div class="col-xs-4 col-md-4">Division</div>
                    <div class="col-xs-8 col-md-8">: {this.state.RequesterDivision}</div>
                  </div>
                  <div class="row">
                    <div class="col-xs-4 col-md-4">Designation</div>
                    <div class="col-xs-8 col-md-8">: {this.state.RequesterDesignation}</div>
                  </div>
                </div>
                </PopoverBody>
              </UncontrolledPopover>
              </div>
             
            </div>
            <div className="form-group row">
              <label for="" className="col-sm-2 col-form-label text-muted">
                GGP Description *
              </label>
              <div className="col-sm-6">
                <textarea className="form-control" placeholder="" rows="3" name="Description" value={this.state.Description} onChange={this.handleChange}></textarea>
                {
                  this.validator1.message('ggp description', this.state.Description, 'required')
                }
              </div>
            </div>
            <div className="text-center text-sm-right">
              <button className="btn btn-draft" type="button" onClick={() => this.saveDraft(1)}>
                <i className="fa fa-pencil-square-o"> </i> Save As Draft
              </button>
              <button className="btn btn-primary-01 ml-3 float-right float-sm-none" type="button" onClick={() => this.formNext(1)}>
                <span className="d-none d-sm-inline">  Next </span> <i className="fa fa-angle-right"> </i>
              </button>
            </div>
          </section>
          {/* Step 1 end here */}

          {/* Step 2 start here */}
          <section style={{display: this.state.step2 }} className="p-3">
            <h2 className="fs-title mb-2 mb-sm-4"> Authorized Carrier </h2>
            <p className="ref-no d-block d-sm-none"> {this.state.Referenceno} </p>
            <div className="form-group row">
              <label for="auth-cat" className="col-sm-2 col-form-label text-muted">
                Authorized Category *
              </label>
              <div className="col-sm-4">
                <div className="form-group">
                  <select className="form-control classic classicSelect" name="Authorizedcategory" value={this.state.Authorizedcategory} onChange={this.handleChange}>
                    {this.state.AuthCategorylistArray.map((loopdata, index) => (  
                        <option value={loopdata.Description}> {loopdata.Description} </option>
                    ))}  
                  </select>
                  {
                    this.validator2_1.message('Authorized Category', this.state.Authorizedcategory, 'required')
                  }
                </div>
              </div>
            </div>
            {(() => {
              if (this.state.Authorizedcategory === "MMHE Staff") {
                return (
                  <>
                  <div className="form-group row mb-2">
                    <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                    Authorized Name *
                    </label>
                    <div className="col-sm-2" >
                      <div className="form-group">
                        <input type="text" onClick={this.showSecondAuthorizedNamePopup} className="form-control" readOnly={true} value={this.state.Authorizedid}  />
                      </div>
                    </div>
                    <div className="col-sm-3" >
                      <div className="form-group">
                      <div className="input-group mb-2 mr-sm-2" >
                        <input type="text" onClick={this.showSecondAuthorizedNamePopup} className="form-control" id="" placeholder="" readOnly={true} value={this.state.Authorizedname}/>
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fa fa-search text-muted"> </i>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row mb-2">
                    <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                    </label>
                    <div className="col-sm-5">
                      {
                        this.validator2_1.message(' Authorized Name', this.state.Authorizedid, 'required')
                      }
                    </div>
                  </div>
                <div className="form-group row">
                  <label for="" className="col-sm-2 col-form-label text-muted">
                    Vehicle Number *
                  </label>
                  <div className="col-sm-4">
                    <div className="input-group mb-2 mr-sm-2">
                    <Autocomplete
                      value={this.state.Vehiclenumber}
                      freeSolo
                      id="free-solo-2-demo"
                      onChange={(event, newValue) => {
                          this.getVehiclenumber(newValue)
                      }}
                      onInputChange={(event, newValue) => {
                        this.getVehiclenumber(newValue)
                      }}                      
                      disableClearable
                      options={this.state.VehiclelistArray.map((option) => option.Description)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label=""
                          margin="normal"
                          variant="outlined"
                          InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                      )}
                    />
                     
                    </div>
                      {
                        this.validator2_1.message('Vehicle Number', this.state.Vehiclenumber, 'required')
                      }
                  </div>
                </div>
                </>
                )
              } else if (this.state.Authorizedcategory === "Supplier's Rep" || this.state.Authorizedcategory === "Subcontractor's Rep") {
                return (
                  <>
                    <div className="form-group row mb-2">
                      <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                      Authorized Name *
                      </label>
                      <div className="col-sm-4">
                      <div className="input-group mb-2 mr-sm-2" >
                        <input type="text" className="form-control" id="" placeholder="" name="Authorizedname" onChange={this.handleChange}  value={this.state.Authorizedname}/></div>
                      </div>
                    </div>
                    <div className="form-group row mb-2">
                      <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                      </label>
                      <div className="col-sm-5">
                        {
                          this.validator2_2.message(' Authorized Name', this.state.Authorizedname, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        IC Number *
                      </label>
                      <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                          <input type="text" className="form-control"  placeholder="" name="Icnumber" value={this.state.Icnumber} onChange={this.handleChange}/>
                        </div>
                        {
                          this.validator2_2.message('Ic number', this.state.Icnumber, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        Authorized Company *
                      </label>
                      <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                          <input type="text" className="form-control" placeholder="" readOnly={true} name="Authorizedcompany" value={this.state.Authorizedcompanyname} onClick={this.showAuthorizedCompanySecondPopup}/>
                          <div className="input-group-prepend" onClick={this.showAuthorizedCompanySecondPopup} >
                            <div className="input-group-text">
                              <i className="fa fa-search text-muted"> </i>
                            </div>
                          </div>
                        </div>
                        {
                          this.validator2_2.message('Authorized Company', this.state.Authorizedcompanyname, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        Company Address *
                      </label>
                      <div className="col-sm-6">
                        <textarea className="form-control" placeholder="" rows="3" name="Authorizedcompanyaddress" value={this.state.Authorizedcompanyaddress} onChange={this.handleChange}></textarea>
                        {
                          this.validator2_2.message('Company Address', this.state.Authorizedcompanyaddress, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        Vehicle Number *
                      </label>
                      <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                        <Autocomplete
                          value={this.state.Vehiclenumber}
                          freeSolo
                          id="free-solo-2-demo"
                          onChange={(event, newValue) => {
                              this.getVehiclenumber(newValue)
                          }}
                          onInputChange={(event, newValue) => {
                            this.getVehiclenumber(newValue)
                          }}                      
                          disableClearable
                          options={this.state.VehiclelistArray.map((option) => option.Description)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=""
                              margin="normal"
                              variant="outlined"
                              InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                          )}
                        />
                        </div>
                        {
                          this.validator2_2.message('Vehicle Number', this.state.Vehiclenumber, 'required')
                        }
                      </div>
                    </div>
                  </>
                )
              } else {
                return (
                  <>
                    <div className="form-group row mb-2">
                      <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                      Authorized Name *
                      </label>
                      <div className="col-sm-4">
                      <div className="input-group mb-2 mr-sm-2" >
                        <input type="text" className="form-control" id="" placeholder="" name="Authorizedname" onChange={this.handleChange}  value={this.state.Authorizedname}/></div>
                      </div>
                    </div>
                    <div className="form-group row mb-2">
                      <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                      </label>
                      <div className="col-sm-5">
                        {
                          this.validator2_3.message(' Authorized Name', this.state.Authorizedname, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        IC Number *
                      </label>
                      <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                          <input type="text" className="form-control"  placeholder="" name="Icnumber" value={this.state.Icnumber} onChange={this.handleChange}/>
                        </div>
                        {
                          this.validator2_3.message('IC Number', this.state.Icnumber, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        Company Address *
                      </label>
                      <div className="col-sm-6">
                        <textarea className="form-control" placeholder="" rows="3" name="Authorizedcompanyaddress" value={this.state.Authorizedcompanyaddress} onChange={this.handleChange}></textarea>
                        {
                          this.validator2_3.message('Company Address', this.state.Authorizedcompanyaddress, 'required')
                        }
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="" className="col-sm-2 col-form-label text-muted">
                        Vehicle Number *
                      </label>
                      <div className="col-sm-4">
                        <div className="input-group mb-2 mr-sm-2">
                        <Autocomplete
                          value={this.state.Vehiclenumber}
                          freeSolo
                          id="free-solo-2-demo"
                          onChange={(event, newValue) => {
                              this.getVehiclenumber(newValue)
                          }}
                          onInputChange={(event, newValue) => {
                            this.getVehiclenumber(newValue)
                          }}                      
                          disableClearable
                          options={this.state.VehiclelistArray.map((option) => option.Description)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=""
                              margin="normal"
                              variant="outlined"
                              InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                          )}
                        />
                        </div>
                        {
                          this.validator2_3.message('Vehicle Number', this.state.Vehiclenumber, 'required')
                        }
                      </div>
                    </div>
                  </>
                )
              }
            })()}
            
            <div className="text-center text-sm-right">
              <button className="btn btn-draft" type="button" onClick={() => this.saveDraft(2)} >
                <i className="fa fa-pencil-square-o"> </i> Save As Draft
              </button>
              <button className="btn btn-primary-01 ml-3 float-right float-sm-none" type="button" onClick={() => this.formNext(2)}>
                <span className="d-none d-sm-inline">  Next </span> <i className="fa fa-angle-right"> </i>
              </button>
              <button className="btn btn-outline-info float-left" type="button" onClick={() => this.formprevious(2)}>
                <i className="fa fa-angle-left"> </i> <span className="d-none d-sm-inline">  Previous </span>
              </button>
            </div>
          </section>
          {/* Step 2 end here */}

          {/* Step 3 start here */}
          <section style={{display: this.state.step3 }} className="p-3">
          <h2 className="fs-title mb-2 mb-sm-4"> Goods Category</h2>
          <p className="ref-no d-block d-sm-none"> {this.state.Referenceno} </p> 
      <div className="form-group row">
        <label for="" className="col-sm-2 col-form-label text-muted"> Goods Category *  </label>
        <div className="col-sm-6">
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="Returnable" value="Returnable" checked={(this.state.Goodscategory === "Returnable") ? "checked" : ""} onChange={this.handleChange}/>
            <label className="form-check-label text-muted" for="inlineRadio1"> Returnable </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="Non-Returnable" value="Non-Returnable" checked={(this.state.Goodscategory === "Non-Returnable") ? "checked" : ""} onChange={this.handleChange}/>
            <label className="form-check-label text-muted" for="inlineRadio2"> Non-Returnable </label>
          </div>
          {
            this.validator3.message('Goods Category', this.state.Goodscategory, 'required')
          }
        </div>
      </div>
      <div className="form-group row">
        <label for="purpose-exit" className="col-sm-2 col-form-label text-muted"> Purpose of Exit * </label>
        <div className="col-sm-3">
          <div className="form-group">
            <select className="form-control classic classicSelect" name="Exitpurpose" value={this.state.Exitpurpose} onChange={this.handleChange}>
                <option value=""> Please Select </option>
                {this.state.ExitPurposelistArray.map((loopdata, index) => (  
                    <option value={loopdata.Description}> {loopdata.Description} </option>
                ))}  
            </select>
          </div>
          {
            this.validator3.message('Purpose of Exit', this.state.Exitpurpose, 'required')
          }
        </div>
        {(() => {
        if (this.state.Exitpurpose === "Others") {
          return (
            <div className="col-sm-3">
              <div className="input-group mb-2 mr-sm-2">
                <input type="text" className="form-control" id="" placeholder="Others" name="Exitpurposeremarks" value={this.state.Exitpurposeremarks} onChange={this.handleChange}/>
              </div>
            </div>
          )
        }
      })()}
      </div>

      {(() => {
        if (this.state.Goodscategory === "Returnable") {
          return (
          <div className="form-group row">
            <label for="" className="col-sm-2 col-form-label text-muted"> Target Date of Return * </label>
            <div className="col-sm-4">
              <div className="input-group mb-2 mr-sm-2">
                <DatePicker format="dd-MM-y" onChange={this.Returndate}  minDate={new Date()} className="date-picker-style form-control" value={new Date(this.state.Returndate)}
                />
              </div>
                
            </div>
          </div>
          )
        }
      })()}
      <div className="form-group row">
        <label for="goods-type" className="col-sm-2 col-form-label text-muted"> Type of Goods * </label>
        <div className="col-sm-6">
          <div className="form-group">
            <select className="form-control classic classicSelect" id="goods-type" name="Goodstype" value={this.state.Goodstype} onChange={this.handleChange}>
                <option value=""> Please Select </option>
                {this.state.TypeofGoodslistArray.map((loopdata, index) => (  
                    <option value={loopdata.Description}> {loopdata.Description} </option>
                ))}  
            </select>
          </div>
            {
              this.validator3.message('Type of Goods', this.state.Goodstype, 'required')
            }
        </div>
      </div>
      <div className="form-group row">
        <label for="" className="col-sm-2 col-form-label text-muted"> Status of Goods *  </label>
        <div className="col-sm-3">
          {this.state.StatusofGoodslistArray.map((loopdata, index) => (  
            <div className="form-check form-check-inline h-100" onClick={() => this.handleGoodsstatus(loopdata.Description)}>
              <input className="form-check-input" type="radio" checked={this.state.Goodsstatus === loopdata.Description ? "checked" : ""}/>
              <label className="form-check-label text-muted" for="inlineRadio3"> {loopdata.Description} </label>
            </div>
          ))}
        </div>
          {(() => {
            if (this.state.Goodsstatus === "Others") {
              return (
                <div className="col-sm-3">
                  <div className="input-group mb-2 mr-sm-2">
                    <input type="text" className="form-control" id="" placeholder="Others" name="Goodsstatusremarks" value={this.state.Goodsstatusremarks} onChange={this.handleChange}/>
                  </div>
                </div>
              )
            }
          })()}
      </div>
      <div className="form-group row">
        <label for="" className="col-sm-2 col-form-label text-muted"></label>
        <div className="col-sm-5">
          {
            this.validator3.message('Status of goods', this.state.Goodsstatus, 'required')
          }
        </div>
      </div>
      <div className="form-group row">
        <label for="" className="col-sm-2 col-form-label text-muted"> Destination of Goods *  </label>
        <div className="col-sm-6">
          <div className="input-group mb-2 mr-sm-2">
            <input type="text" className="form-control" id="" placeholder="" name="Goodsdestination" value={this.state.Goodsdestination} onChange={this.handleChange}/>
          </div>
          {
            this.validator3.message('Destination of goods', this.state.Goodsdestination, 'required')
          }
        </div>
      </div>
      <div className="form-group row">
        <label for="goods-exit-time" className="col-sm-2 col-form-label text-muted">  Goods Exit Time * </label>
        <div className="col-sm-6">
          <div className="form-group">
            <select className="form-control classic classicSelect" id="goods-exit-time" name="Goodsexittime" value={this.state.Goodsexittime} onChange={this.handleChange}>
                <option value=""> Please Select </option>
                {this.state.ExitTimelistArray.map((loopdata, index) => (  
                    <option value={loopdata.Description}> {loopdata.Description} </option>
                ))}  
            </select>
          </div>
          {
            this.validator3.message('Goods Exit time', this.state.Goodsexittime, 'required')
          }
          </div>
      </div>
           {(() => {
            if (this.state.Goodsexittime === "After Office Hour" || this.state.Goodsexittime === "Off Day / Public Holiday") {
              return (
                <div className="form-group row">
                <label for="goods-exit-time" className="col-sm-2 col-form-label text-muted">  Exit Time Justification * </label>
               
                <div className="col-sm-6">
                
                <div className="input-group mb-2 mr-sm-2">                   
                  <textarea className="form-control" id="" placeholder="" rows="3" name="Goodsexittimeremarks" value={this.state.Goodsexittimeremarks} onChange={this.handleChange}></textarea>
                </div> 
             
                      {
                        this.validator3.message('Goods Exit time remarks', this.state.Goodsexittimeremarks, 'required')
                      } 
                    
                </div>
                
                
              </div>     
              )
            }
          })()}
  
          
      <div className="form-group row">
        <label for="" className="col-sm-2 col-form-label text-muted"> Company Name & Address * </label>
        <div className="col-sm-6">
          <textarea className="form-control" id="" placeholder="" rows="3" name="Goodscompanyaddress" value={this.state.Goodscompanyaddress} onChange={this.handleChange}></textarea>
          {
            this.validator3.message('Company Name & Address', this.state.Goodscompanyaddress, 'required')
          }
        </div>
      </div>
      <div className="text-center text-sm-right">
              <button className="btn btn-draft" type="button" onClick={() => this.saveDraft(3)}>
                
                <i className="fa fa-pencil-square-o"> </i> Save As Draft
              </button>
              <button className="btn btn-primary-01 ml-3 float-right float-sm-none" type="button" onClick={() => this.formNext(3)}>
                
                <span className="d-none d-sm-inline">  Next </span> <i className="fa fa-angle-right"> </i>
              </button>

              <button className="btn btn-outline-info float-left" type="button" onClick={() => this.formprevious(3)}>
                
                <i className="fa fa-angle-left"> </i> <span className="d-none d-sm-inline">  Previous </span>
              </button>
            </div>
          </section>
          {/* Step 3 end here */}

          {/* Step 4 start here */}
          <section style={{display: this.state.step4 }} className="p-3">
          <h2 className="fs-title mb-2 mb-sm-4"> Goods Item </h2> 
          <p className="ref-no d-block d-sm-none"> {this.state.Referenceno} </p>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-lightBlue">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col"> Qty </th>
                  <th scope="col"> Serial No </th>
                  {/*(() => {
                    if (this.state.Goodscategory === "Returnable") {
                      return (
                        <th scope="col"> Qty to be Return </th>
                      )
                    }
                  })()*/}
                  <th scope="col"> Description  </th>
                  <th scope="col" className="position-relative"> 
                    Action 
                    <button className="btn btn-success btn-sm action-btn" onClick={this.addGoods}> <span className="font-size-17">+</span> </button>
                  </th>
                </tr>
              </thead>
              <tbody style={{display: (this.state.goodsItemLoader === "Yes" ? "none" : "") }}>
                {this.state.GoodsItemslistArray.map((loopdata, index) => (
                  <tr>  
                    <td>{index + 1}</td>
                    <td>{loopdata.Qtyunit}</td>
                    <td>{loopdata.Serialno}</td>
                    {/* {(() => {
                      if (this.state.Goodscategory === "Returnable") {
                        return (
                          <td>{loopdata.Qtyreturn}</td>
                        )
                      }
                    })()} */}
                    <td>{loopdata.Description}</td>
                    <td>
                      <div className="action-icons"> 
                      <i className="fa fa-pencil-square-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => this.editGoodsItemshow(loopdata.Sequenceno)}></i>
                      <i className="fa fa-trash-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => this.deleteGoodsItem(loopdata.Sequenceno)}></i>
                    </div>
                    </td>
                  </tr>
                ))}  
               
                <tr style={{display: this.state.GoodsItemAdd }}>
                  <td>  </td>
                  <td> <input className="form-control" type="text" pattern="[0-9]*" style={{minWidth:"50px"}} placeholder="qty"  name="GoodsItem_Qtyunit" value={this.state.GoodsItem_Qtyunit} onChange={this.handleChange} /> </td>
                  
                  <td> <input className="form-control" type="text" placeholder="Serial No" name="GoodsItem_Serialno" value={this.state.GoodsItem_Serialno} onChange={this.handleChange}/> </td>

                  {/* {(() => {
                    if (this.state.Goodscategory === "Returnable") {
                      return (
                        <td> <input className="form-control" type="number" placeholder="Quantity to be Return" name="GoodsItem_Qtyreturn" value={this.state.GoodsItem_Qtyreturn} onChange={this.handleChange}/> </td>
                      )
                    }
                  })()} */}
                   <td> 
                    <textarea className="form-control" id="" placeholder="Description" rows="3" name="GoodsItem_Description" value={this.state.GoodsItem_Description} onChange={this.handleChange}></textarea> 
                  </td>
                  <td>
                    <div className="btn-group"> 
                      <button className="btn btn-default btn-md" type="button" onClick={this.saveGoodsItem}> <i className="fa fa-floppy-o text-muted" aria-hidden="true" ></i> Save  </button>
                      <button className="btn btn-default btn-md ml-3" type="button" onClick={this.removeGoodsItem}> <i className="fa fa-trash-o text-muted" aria-hidden="true"></i> Remove  </button>
                    </div>
                  </td>
                </tr>
                
                {(() => {
                  if (this.state.Goodscategory === "Returnable") {
                    return (
                      <tr style={{display: this.state.GoodsItemAdd }}>
                      <td> </td>
                      <td> { this.validator5_2.message('Qty', this.state.GoodsItem_Qtyunit, 'required') } </td>
                      <td>  </td>
                      {/* <td> { this.validator5_2.message('Quantity to be Return', this.state.GoodsItem_Qtyreturn, 'required')} </td> */}
                      <td> { this.validator5_2.message('Description', this.state.GoodsItem_Description, 'required') } </td>
                        <td></td>
                      </tr>
                    )
                  }else{
                    return (
                      <tr style={{display: this.state.GoodsItemAdd }}>
                      <td> </td>
                      <td> { this.validator5.message('Qty', this.state.GoodsItem_Qtyunit, 'required') } </td>
                      <td>  </td>
                      <td> { this.validator5.message('Description', this.state.GoodsItem_Description, 'required') } </td>
                        <td></td>
                      </tr>
                    )
                  }
                })()}
                
              </tbody>
              </table>
              {(() => {
                if (this.state.GoodsItemslistArray.length <= 0) {
                  return (
                    <div style={{display: (this.state.GoodsItemAdd === "none" ? "" : "none") }}>
                      <p className="text-center">No record found.</p>                 
                    </div>
                  )
                }
              })()}
              <p className="text-center" style={{display: (this.state.goodsItemLoader === "Yes" ? "" : "none") }}><Spinner animation="border" variant="primary" className="text-center" /></p>
              <div class="text-danger text-center" style={{display: this.state.showGoodsItemRequired }}>The Goods Item is required.</div>
            </div>
            <div className="text-center text-sm-right">
              <button className="btn btn-draft" type="button" onClick={() => this.saveDraft(4)}>
                
                <i className="fa fa-pencil-square-o"> </i> Save As Draft
              </button>
              <button className="btn btn-primary-01 ml-3 float-right float-sm-none" type="button" onClick={() => this.formNext(4)}>
                
                <span className="d-none d-sm-inline">  Next </span> <i className="fa fa-angle-right"> </i>
              </button>

              <button className="btn btn-outline-info float-left" type="button" onClick={() => this.formprevious(4)}>
                
                <i className="fa fa-angle-left"> </i> <span className="d-none d-sm-inline">  Previous </span>
              </button>
            </div>
          </section>
          {/* Step 4 end here */}

          {/* Step 5 start here */}
          <section style={{display: this.state.step5 }} className="p-3">
          <h2 className="fs-title mb-2 mb-sm-4"> Attachments * </h2> 
          <p className="ref-no d-block d-sm-none"> {this.state.Referenceno} </p>
          <div >
            <Dropzone onDrop={this.onDrop} >
              {({getRootProps, getInputProps}) => (
                <div  className="jumbotron text-center attachmentStyle" {...getRootProps()}>
                  <input {...getInputProps()} />
                  Drag and drop files , Or click to select attachment files
                </div>
              )}
            </Dropzone>
          </div>
         
    <div className="table-responsive"> 
    <table className="table table-hover">
      <thead className="thead-lightBlue">
        <tr>
          <th scope="col">#</th>
          <th scope="col"> File Name  </th>
          <th scope="col"> File Type  </th>
          <th scope="col"> Remarks </th>
          <th scope="col" className="position-relative"> 
          </th>
        </tr>
      </thead>
      <tbody style={{display: (this.state.AttachmentsLoader === "Yes" ? "none" : "") }}>
        {this.state.AttachmentslistArray.map((loopdata, index) => (  
          <tr>  
            <td>{index + 1}</td>
            <td>{loopdata.Filename}</td>
            <td>{loopdata.Filetype}</td>
            <td>{loopdata.Remarks}</td>
            <td>
              <div className="action-icons"> 
              <i className="fa fa-pencil-square-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => this.editAttachmentsShow(loopdata.Sequenceno, loopdata.Filename, loopdata.Filetype, loopdata.Remarks, loopdata.URL)}></i>
              <i className="fa fa-trash-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => this.deleteAttachment(loopdata.Sequenceno)}></i>
            </div>
            </td>
          </tr>
        ))}
       
      </tbody>
      </table>
       {(() => {
          if (this.state.AttachmentslistArray.length <= 0) {
            return (
              <div>
                <p className="text-center">No record found.</p>                 
              </div>
            )
          }
        })()}
         <p className="text-center" style={{display: (this.state.AttachmentsLoader === "Yes" ? "" : "none") }}><Spinner animation="border" variant="primary" className="text-center" /></p>
         <div class="text-danger text-center" style={{display: this.state.showAttachedRequired }}>The Attachments is required.</div>
      </div>
      <h2 className="fs-title"> References  </h2> 
      <div className="table-responsive"> 
      <table className="table table-hover">
        <thead className="thead-lightBlue">
          <tr>
            <th scope="col">#</th>
            <th scope="col"> Reference Link  </th>
            <th scope="col"> Remarks </th>
            <th scope="col" className="position-relative"> 
              Action 
              <button className="btn btn-success btn-sm action-btn" onClick={this.addReferences}> <span className="font-size-17">+</span> </button>
            </th>
          </tr>
        </thead>
        <tbody style={{display: (this.state.ReferencesLoader === "Yes" ? "none" : "") }}>

          {this.state.ReferenceLinkslistArray.map((loopdata, index) => (  
            <tr>  
              <td>{index + 1}</td>
              <td>{loopdata.Reflink}</td>
              <td>{loopdata.Remarks}</td>
              <td>
                <div className="action-icons"> 
                <i className="fa fa-pencil-square-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => this.editReferencesShow(loopdata.Sequenceno, loopdata.Reflink, loopdata.Remarks)}></i>
                <i className="fa fa-trash-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => this.deleteReferences(loopdata.Sequenceno)}></i>
              </div>
              </td>
            </tr>
          ))}

         {/*} <tr>
            <td>1</td>
            <td> 025050MHB025050  </td>
            <td> Remarks Goes here remarks Goes here </td>
            <td>
              <div className="action-icons"> 
              <i className="fa fa-pencil-square-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit"></i>
              <i className="fa fa-trash-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Delete"></i>
              </div>
            </td>
      </tr> */}
         
          <tr style={{display: this.state.ReferencesAdd }}>
            <td></td>
            <td> <input className="form-control" type="text" placeholder="" name="References_Reflink" value={this.state.References_Reflink} onChange={this.handleChange}/>   </td>
            <td> <input className="form-control" type="text" placeholder="Enter remarks" name="References_Remarks" value={this.state.References_Remarks} onChange={this.handleChange}/> </td>
            <td>
              <div className="btn-group"> 
                <button className="btn btn-default btn-md" type="button" onClick={this.References_Save}> <i className="fa fa-floppy-o text-muted" aria-hidden="true"></i> Save  </button>
                <button className="btn btn-default btn-md ml-3" type="button" onClick={this.References_Cancel}> <i className="fa fa-trash-o text-muted" aria-hidden="true"></i> Remove  </button>
              </div>
            </td>
          </tr>
          <tr style={{display: this.state.ReferencesAdd }}>
            <td> </td>
            <td> { this.validator6.message('Qty', this.state.References_Reflink, 'required') }  </td>
            <td> { this.validator6.message('Qty', this.state.References_Remarks, 'required') }  </td>
            <td> </td>
          </tr>
        </tbody>
        </table>
        {(() => {
          if (this.state.ReferenceLinkslistArray.length <= 0) {
            return (
              <div style={{display: (this.state.ReferencesAdd === "none" ? "" : "none") }}>
                <p className="text-center">No record found.</p>                 
              </div>
            )
          }
        })()}
        <p className="text-center" style={{display: (this.state.ReferencesLoader === "Yes" ? "" : "none") }}><Spinner animation="border" variant="primary" className="text-center" /></p>
         <div class="text-danger text-center" style={{display: this.state.showReferenceRequired }}>The References is required.</div>
        </div>
        <div className="text-center text-sm-right">
              <button className="btn btn-draft" type="button" onClick={() => this.saveDraft(5)}>
                <i className="fa fa-pencil-square-o"> </i> Save As Draft
              </button>
              <button className="btn btn-primary-01 ml-3 float-right float-sm-none" type="button" onClick={this.saveCreateRequest}>
                <i className="fa fa-save"> </i> <span className="d-none d-sm-inline">  Save </span>
              </button>
              <button className="btn btn-outline-info float-left" type="button" onClick={() => this.formprevious(5)}>
                <i className="fa fa-angle-left"> </i> <span className="d-none d-sm-inline">  Previous </span>
              </button>
            </div>
          </section>
         {/* Step 5 end here */}
        </div>

        <Modal show={this.state.getEmployeeFirstShow} size="lg">  
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
                        <tr onClick={()=>this.getStaffDetails(staff.EmployeeId, staff.Name, staff.Section, staff.SectionName, staff.Department, staff.Division, staff.Designation)} className="cursor-pointer">  
                          <td > <p> <span class="material-icons-outlined select-employee-icon"> how_to_reg </span> </p> </td>
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
                  if (this.state.StaffDetailslistArray.length <= 0 && this.state.StaffDetailslistArraySpin === "none") {
                    return (
                      <p className="text-center">No record found.</p>                 
                    )
                  }
                })()}
                <p class="text-center"><Spinner animation="border" variant="primary" style={{display: this.state.StaffDetailslistArraySpin }} className="text-center" /></p>
              </div>
            </section>
          </Modal.Body>  
          <Modal.Footer>  
            <Button className="btn btn-light" onClick={()=>this.hideFirstStaffPopup()}>Close</Button>  
          </Modal.Footer>  
        </Modal>

        <Modal show={this.state.getAuthorizedNameSecondShow} size="lg">  
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
                        <tr onClick={()=>this.getAuthorizedNameDetails(staff.EmployeeId, staff.Name)} className="cursor-pointer">  
                          <td> <p> <span class="material-icons-outlined select-employee-icon"> how_to_reg </span> </p> </td>
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
                  if (this.state.StaffDetailslistArray.length <= 0 && this.state.StaffDetailslistArraySpin === "none") {
                    return (
                      <p className="text-center">No record found.</p>                 
                    )
                  }
                })()}
                <p class="text-center"><Spinner animation="border" variant="primary" style={{display: this.state.StaffDetailslistArraySpin }} className="text-center" /></p>
              </div>
            </section>
          </Modal.Body>  
          <Modal.Footer>  
            <Button className="btn btn-light" onClick={()=>this.hideSecondAuthorizedNamePopup()}>Close</Button>  
          </Modal.Footer>  
        </Modal>

        <Modal show={this.state.getAuthorizedCompanySecondShow} size="lg">  
          <Modal.Header >Company Look Up</Modal.Header>  
          <Modal.Body>
            <section className="p-3">
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                  Company No
                </label>
                <div className="col-sm-4">
                  <div className="form-group">
                    <input type="text" className="form-control" name="popupCompanyNo" value={this.state.popupCompanyNo} onChange={this.handleChange} onKeyDown={this._handleKeyDownCompany}/>
                  </div>
                </div>
              </div>
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                  Company Name
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input type="text" className="form-control" name="popupCompanyName" value={this.state.popupCompanyName} onChange={this.handleChange} onKeyDown={this._handleKeyDownCompany}/>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button className="btn btn-light"  onClick={()=>this.searchCompanyClear()}> Clear </Button> 
                <Button className="btn btn-primary-01 ml-3" onClick={this.searchCompany}> Search </Button>  
              </div>
            </section>
            <hr></hr>
            <section> 
              <h2 className="fs-title"> </h2>
              <div className="table-responsive max-height-280"> 
                <table className="table table-hover">
                  <thead className="thead-lightBlue">
                    <tr>
                      <th scope="col"> </th>
                      <th scope="col"> Company No  </th>
                      <th scope="col"> Company Name  </th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.state.companylistArray.map((Company, index) => (  
                        <tr onClick={()=>this.getCompanayDetails(Company.CompanyNo, Company.CompanyName)} className="cursor-pointer">  
                          <td> <p> <span class="material-icons-outlined select-employee-icon"> how_to_reg </span> </p> </td>
                          <td> {Company.CompanyNo} </td>
                          <td> ({Company.CompanyName}) </td>
                      </tr>
                    ))}  
                  </tbody>
                </table>
                {(() => {
                  if (this.state.companylistArray.length <= 0 && this.state.companylistArraySpin === "none") {
                    return (
                      <p className="text-center">No record found.</p>                 
                    )
                  }
                })()}
                <p className="text-center"><Spinner animation="border" variant="primary" style={{display: this.state.companylistArraySpin }} className="text-center" /></p>
              </div>
            </section>
          </Modal.Body>  
          <Modal.Footer>  
            <Button className="btn btn-light" onClick={()=>this.hideAuthorizedCompanySecondPopup()}>Close</Button>  
          </Modal.Footer>  
        </Modal>

        <Modal show={this.state.goodsItemEdit} size="lg">  
          <Modal.Header >Edit</Modal.Header>  
          <Modal.Body>
            <section className="p-3">
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                  Qty
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input type="text" pattern="[0-9]*" className="form-control" name="GoodsItem_Edit_Qtyunit" value={this.state.GoodsItem_Edit_Qtyunit} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                  Serial No
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input type="text" className="form-control" name="GoodsItem_Edit_Serialno" value={this.state.GoodsItem_Edit_Serialno} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>
              {/*(() => {
                    if (this.state.Goodscategory === "Returnable") {
                      return (
                        <div className="form-group row mb-1">
                        <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                        Qty to be Return
                        </label>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input type="text" className="form-control" name="GoodsItem_Edit_Qtyreturn" value={this.state.GoodsItem_Edit_Qtyreturn} onChange={this.handleChange}/>
                          </div>
                        </div>
                      </div>
                      )
                    }
                  })()*/}
              
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Description
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <textarea className="form-control" id="" placeholder="Description" rows="3" name="GoodsItem_Edit_Description" value={this.state.GoodsItem_Edit_Description} onChange={this.handleChange}></textarea> 
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button className="btn btn-light"  onClick={()=>this.editGoodsItemCancel()}> Cancel </Button> 
                <Button className="btn btn-primary-01 ml-3" onClick={this.UpdateGoodsItems}> Update </Button>  
              </div>
            </section>
          </Modal.Body>  
        </Modal>
        
        <Modal show={this.state.goodsItemdeletePopup}>  
          <Modal.Header >Delete Confirmation</Modal.Header>  
          <Modal.Body>
            <div class="alert alert-danger" role="alert">
              Are you sure you want to delete?
            </div>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelgoodsItemDelete}> No </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.confirmgoodsItemDelete}> Yes </Button>  
            </div>
          </Modal.Body>  
        </Modal>

        <Modal show={this.state.editAttachments} size="lg">  
          <Modal.Header >Edit</Modal.Header>  
          <Modal.Body>
            <section className="p-3">
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                 Remarks
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input type="text" className="form-control" name="editAttachments_Remarks" value={this.state.editAttachments_Remarks} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button className="btn btn-light"  onClick={()=>this.editAttachmentsHide()}> Cancel </Button> 
                <Button className="btn btn-primary-01 ml-3" onClick={this.UpdateAttachments}> Update </Button>  
              </div>
            </section>
          </Modal.Body>  
        </Modal>

        <Modal show={this.state.attachmentdeletePopup}>  
          <Modal.Header >Delete Confirmation</Modal.Header>  
          <Modal.Body>
            <div class="alert alert-danger" role="alert">
              Are you sure you want to delete?
            </div>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelattachmentDelete}> No </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.confirmattachmentDelete}> Yes </Button>  
            </div>
          </Modal.Body>  
        </Modal>
        
        <Modal show={this.state.editReferences} size="lg">  
          <Modal.Header >Edit</Modal.Header>  
          <Modal.Body>
            <section className="p-3">
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Reference Link
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input type="text" className="form-control" name="editReferences_Reflink" value={this.state.editReferences_Reflink} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>
              <div className="form-group row mb-1">
                <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Remarks
                </label>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input type="text" className="form-control" name="editReferences_Remarks" value={this.state.editReferences_Remarks} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button className="btn btn-light"  onClick={()=>this.editReferencesHide()}> Cancel </Button> 
                <Button className="btn btn-primary-01 ml-3" onClick={this.UpdateReferences}> Update </Button>  
              </div>
            </section>
          </Modal.Body>  
        </Modal>
        
        <Modal show={this.state.referencesdeletePopup}>  
          <Modal.Header >Delete Confirmation</Modal.Header>  
          <Modal.Body>
            <div class="alert alert-danger" role="alert">
              Are you sure you want to delete?
            </div>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelreferencesDelete}> No </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.confirmreferencesDelete}> Yes </Button>  
            </div>
          </Modal.Body>  
        </Modal>

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menuVisibility: state.menuVisibility,
    menuStatusHeader: state.menuStatusHeader,
    headerTitle: state.headerTitle,
    getToken: state.token,
    userType: state.userType,
    userName: state.userName,
    UserId: state.UserId,
    Referenceno: state.Referenceno,
  };
};

export default connect(mapStateToProps)(pendingEdit);
