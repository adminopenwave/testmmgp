import React, { Component } from "react";
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import Select from 'react-select';
import { connect } from "react-redux";
import 'bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleReactValidator from 'simple-react-validator';

toast.configure();
class ApproverList extends Component {
  constructor(props) {
    super(props);
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    var Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator1 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
      Referenceno: Referenceno,
      getApproverListArray: [],
      addbuttondisplay: "block",
      canaddfirstApprover: "none",
      canaddsecondApprover: "none",
      getEmployeeFirstShow: false,
      approverDelete: false,
      SectionlistArray: [],
      StaffDetailslistArray: [],
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
      Oriapproverid: "",
      Oriapprovername: "",
      Comments: "",
      Workflowid: "",
      showApproverRequired: "none",
      canEnableSave: "no",
      EditWorkflowid: "",
      EditRequesterId: "",
      EditRequesterName: "",
      stafflistArraySpin : "none",
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: "headerTitle", value: ((this.state.Referenceno) ? "Approver List - " + this.state.Referenceno : "Approver List")});
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    let bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    let Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.setState({ Referenceno: Referenceno }, ()=> this.getApproverList())

    this.GetSectionListData()
      // let postData = { 
      //   Referenceno: this.state.Referenceno,
      // }
      // fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertWorkFlow', {
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + this.props.getToken,
      // },
      // body: JSON.stringify(postData)
      // }).then(response=>{
      //   if(response.status === 200){
      //       return response.json()
      //   }else if(response.status === 401){
      //       this.props.dispatch({ type: 'Token', value: "" });
      //       this.props.dispatch({ type: 'profile', value: "" });
      //       this.props.dispatch({ type: 'userType', value: "" });
      //   }
      // })
      // .then(data => {
        //console.log("Work Flow")
        //console.log(data)
        // if(data.ApproversList){
        //   data.ApproversList.map(appList => {
        //     let postData = { 
        //       Mode: "Add",
        //       Workflowid: appList.Workflowid,
        //       Sequenceno: appList.Sequenceno,
        //       Referenceno: this.state.Referenceno,
        //       Oriapproverid :appList.Oriapproverid,
        //       Oriapprovername :appList.Oriapprovername,
        //       Comments: appList.Comments
        //     }
        //     fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateApprovers', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': 'Bearer ' + this.props.getToken,
        //     },
        //     body: JSON.stringify(postData)
        //     }).then(response=>{
        //       if(response.status === 200){
        //           return response.json()
        //       }else if(response.status === 401){
        //           this.props.dispatch({ type: 'Token', value: "" });
        //           this.props.dispatch({ type: 'profile', value: "" });
        //           this.props.dispatch({ type: 'userType', value: "" });
        //       }
        //     })
        //     .then(data => {
        //       if(data){
        //         this.getApproverList();
        //         this.setState({ canEnableSave: "yes"})
        //       }
        //     })
        //   })
        // }else{
        //   this.getApproverList()
        //   this.setState({ canEnableSave: "yes"})
        // }
      // })
   
  }

  searchEmployeeClear = () =>{
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] ,stafflistArraySpin: "none"  })
  }

  getStaffDetails = (id, name, Section, SectionName, Department, Division, Designation) =>{

    if(this.state.EditWorkflowid){
      this.setState({ EditRequesterId: id, EditRequesterName: name, RequesterDisplayName: id +" - "+ name, getEmployeeFirstShow: false }, ()=> this.updateApprover())
    }else{
    this.setState({ RequesterId: id, RequesterName: name, RequesterSection: Section, RequesterSectionName: SectionName, RequesterDepartment: Department, RequesterDivision: Division, RequesterDesignation: Designation, canStafNamePopover: "flex", getEmployeeFirstShow: false, RequesterDisplayName: id +" - "+ name})
    }
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
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
        this.setState({ StaffDetailslistArray: data.StaffDetails, stafflistArraySpin: "none" })
      }
    })
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
      //console.log("getApproverList")
      //console.log(data)
      if(data){
        this.setState({ getApproverListArray: data.ApproversList})
        this.setState({ canEnableSave: "yes"})
        // alert(data.ApproversList.length)
        if(data.ApproversList.length >= 2){
          this.setState({ addbuttondisplay: "none"})
        }else{
          this.setState({ addbuttondisplay: ""})
        }
      }
    })
  }
  save = () =>{
    console.log("1")
    if (this.validator1.allValid()) {
      console.log("2")
      if(this.state.getApproverListArray.length <=1)
      {
        console.log("3")
        this.setState({ showApproverRequired: ""})
      }else{
        console.log("4")
        let postData = { 
          Referenceno: this.state.Referenceno,
        }
        console.log(postData)
        fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/SubmitRequest', {
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
            toast.success("Request created successfully.", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
            this.props.history.push({ pathname: "/pending/list" });
          }
        })
      }
    } else {
      this.validator1.showMessages();
      this.forceUpdate();
    }
  }

  showAddApproverForm = () =>{
    //alert('a')
    this.setState({ canaddsecondApprover: "", showApproverRequired: "none"})
  }

  addApprover = () =>{
    let postData = { 
      Workflowid: "",
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
      //console.log("Get Approver")
      //console.log(data)
      if(data){
        if(data.ApproversList.length >= 2){
        }else if(data.ApproversList.length >= 1){
          this.setState({ canaddsecondApprover: ""})
        }
      }
    })
  }

  showFirstStaffPopup = () =>{
    this.setState({ getEmployeeFirstShow: true});
  }
  hideFirstStaffPopup = () =>{
    this.setState({ getEmployeeFirstShow: false});
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  deleteItem = (Workflowid) =>{
    this.setState({ approverDelete: true, Workflowid: Workflowid});
  }

  deleteCancel = () =>{
    this.setState({ approverDelete: false, Workflowid: ""});
  }


  confirmDelete = () =>{
    let postData = { 
      Mode: "Delete",
      Workflowid: this.state.Workflowid,
      Referenceno: this.state.Referenceno,
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateApprovers', {
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
      //console.log("Delete Approver")
      //console.log(data)
      if(data){
        this.setState({ approverDelete: false, Workflowid: "",RequesterDisplayName:""});
        this.getApproverList()
      }
    })
  }

  updateApprover = () =>{
    let postData = { 
      Mode: "Update",
      Workflowid: this.state.EditWorkflowid,
      Referenceno: this.state.Referenceno,
      Oriapproverid: this.state.EditRequesterId,
      Oriapprovername: this.state.EditRequesterName,
      Comments: ""
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateApprovers', {
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
      //console.log("Update Approver")
      //console.log(data)
      if(data){
        // this.setState({ approverDelete: false, Workflowid: ""});
        this.getApproverList()
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
      case "Comments":
        this.setState({ Comments: e.target.value })
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

  saveApprover = () => {
    if (this.validator.allValid()) {
      let postData = { 
        Mode: "Add",
        Workflowid: "",
        Sequenceno: "1",
        Referenceno: this.state.Referenceno,
        Oriapproverid: this.state.RequesterId,
        Oriapprovername: this.state.RequesterName,
        Comments: this.state.Comments,
      }
      fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateApprovers', {
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
        //console.log("Add Approver")
        //console.log(postData)
        //console.log(data)
        if(data){ 
          this.setState({ canaddsecondApprover: "none", RequesterId: "", RequesterName: "", Comments: "", RequesterDisplayName: ""})
          this.getApproverList()
        }
      })
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  cancleApproverAdd = () =>{
    this.setState({ canaddsecondApprover: "none", RequesterId: "", RequesterName: "", Comments: "", RequesterDisplayName: ""})
  }

  cancelForm = () =>{
    toast.success("Request saved successfully.", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    this.props.history.push({ pathname: "/draft/list" });
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.searchEmployee()
    }
  }

  editApprover = (Workflowid) =>{
    this.setState({ EditWorkflowid: Workflowid, getEmployeeFirstShow: "true" })
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
          <Breadcrumb.Item href="">Create Request</Breadcrumb.Item>
          <Breadcrumb.Item active>Approver List</Breadcrumb.Item>
        </Breadcrumb>
       
        <div className="content-area shadow p-3 mb-5 bg-white rounded">

        <section className="p-3">
    <div className="headerStyle">
      <b> Approver List </b>
    </div>
      <div className="table-responsive"> 
      <table className="table table-hover">
        <thead className="thead-lightBlue">
          <tr>
            {/*<th scope="col">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                <label className="custom-control-label" for="customCheck1"></label>
              </div>
            </th> */}
            <th scope="col"> Sequence No  </th>
            <th scope="col"> Approver </th>
            <th scope="col"> Status  </th>
            <th scope="col"> Comments  </th>
            <th scope="col" className="position-relative">Action <button className="btn btn-primary btn-sm action-btn" style={{display: this.state.addbuttondisplay }} onClick={this.showAddApproverForm}> <span className="font-size-17">+</span> </button></th>
          </tr>
        </thead>
        <tbody>
          {this.state.getApproverListArray.map((loopdata, index) => (  
              <tr>
               {/*<td>
                 <div className="custom-control custom-checkbox">
                   <input type="checkbox" className="custom-control-input" id="customCheck1" />
                   <label className="custom-control-label" for="customCheck1"></label>
                 </div>
               </td> */}
               <td> {loopdata.Sequenceno} </td>
               {(() => {
                if (loopdata.Oriapproverid === "0" || loopdata.Oriapproverid === 0) {
                  return (
                    <td> 
                      <div className="form-group row">
                        <div className="col-sm-8">
                          <div className="input-group mb-2 mr-sm-2" >
                            <input type="text" className="form-control" id="" placeholder="" readOnly={true} onClick={() => this.editApprover(loopdata.Workflowid)} value={this.state.RequesterDisplayName} />
                            <div className="input-group-prepend" >
                              <div className="input-group-text">
                                <i className="fa fa-search text-muted"> </i>
                              </div>
                            </div>
                          </div>
                          {
                            this.validator1.message('Verifier', this.state.RequesterDisplayName, 'required')
                          }
                        </div>
                      </div>  
                    </td>
                      )
                  }else{
                    return ( <td> {loopdata.Oriapproverid} / {loopdata.Oriapprovername} </td> )
                  }
                })()}
               {(() => {
                  if (loopdata.IsEdit !== 1 && loopdata.IsEdit !== "1") {
                  return ( 
                    <td>  </td>
                  )
                  }else{
                    return ( <td> </td> )
                  }
                })()}
                {(() => {
                  if (loopdata.IsEdit !== 1 && loopdata.IsEdit !== "1") {
                  return ( 
                    <td> {loopdata.Comments} </td>
                  )
                  }else{
                    return ( <td> </td> )
                  }
                })()}
               {(() => {
                  if (loopdata.IsEdit === 1 || loopdata.IsEdit === "1") {
                  return (
                    <td>
                      <div className="action-icons"> 
                        <i className="fa fa-pencil-square-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => this.editApprover(loopdata.Workflowid)}></i>
                        <i className="fa fa-trash-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => this.deleteItem(loopdata.Workflowid)}></i>
                      </div>
                    </td>
                    )
                  }else{
                    return (
                      <td>
                       
                      </td>
                      )
                  }
              })()}
               
             
              </tr>
          ))}  
          <tr style={{display: this.state.canaddsecondApprover}}>
            {/*<td>
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                <label className="custom-control-label" for="customCheck1"></label>
              </div>
            </td> */}
            <td> </td>
            <td> 
              <div className="form-group row">
                <div className="col-sm-8">
                  <div className="input-group mb-2 mr-sm-2" >
                    <input type="text" className="form-control" id="" placeholder="" onClick={this.showFirstStaffPopup} readOnly={true} value={this.state.RequesterDisplayName} />
                    <div className="input-group-prepend" >
                      <div className="input-group-text">
                        <i className="fa fa-search text-muted"> </i>
                      </div>
                    </div>
                  </div>
                  {
                    this.validator.message('Approver', this.state.RequesterDisplayName, 'required')
                  }
                </div>
              </div>  
            </td>
            <td> </td>
            <td> </td>
            <td>
              <div className="btn-group"> 
                <button className="btn btn-default btn-md" type="button" onClick={this.saveApprover}> <i className="fa fa-floppy-o text-muted" aria-hidden="true"></i> Save  </button>
                <button className="btn btn-default btn-md ml-3" type="button"  onClick={this.cancleApproverAdd}> <i className="fa fa-trash-o text-muted" aria-hidden="true"></i> Remove  </button>
              </div>
            </td>
          </tr>
          
        </tbody>
        </table>
        <div className="text-danger text-center" style={{display: this.state.showApproverRequired }}>The Approver is required.</div>
        <div className="text-center text-sm-right">
        {(() => {
              if (this.state.canEnableSave === "no") {
                return (
                  <button className="btn btn-secondary ml-3 float-right float-sm-none mr-4" disabled type="button">
                  <i className="fa fa-save"> </i> <span className="d-none d-sm-inline">  Submit </span>
                  </button>
                )
              }else{
                return (
                  <button className="btn btn-primary-01 ml-3 floazt-right float-sm-none mr-4" type="button" onClick={this.save}>
                  <i className="fa fa-save"> </i> <span className="d-none d-sm-inline">  Submit </span>
                  </button>
                )
              }
          })()}

          <button className="btn btn-outline-info float-right" type="button" onClick={this.cancelForm}>
            <i className="fa fa-angle-left"> </i> <span className="d-none d-sm-inline">  Cancel </span>
          </button>
        </div>
        </div>
       
          </section>
          <section className="p-3">
        <div className="card">
        <div className="headerStyle">
          <b> Workflow History </b>
        </div>
          <div className="card-body">
            <h5 className="card-title text-center">No Records Found</h5>
          </div>
        </div>
        </section>
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
            <Button className="btn btn-light" onClick={()=>this.hideFirstStaffPopup()}>Close</Button>  
          </Modal.Footer>  
        </Modal>

        <Modal show={this.state.approverDelete}>  
          <Modal.Header >Delete Confirmation</Modal.Header>  
          <Modal.Body>
            <div className="alert alert-danger" role="alert">
              Are you sure you want to delete?
            </div>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.deleteCancel}> No </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.confirmDelete}> Yes </Button>  
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
  };
};

export default connect(mapStateToProps)(ApproverList);
