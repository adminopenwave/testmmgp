import React, { Component } from 'react';
import { Modal,Button,Breadcrumb } from "react-bootstrap";
import FloatingButton from '../../Material/FloatingButton';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import { connect } from "react-redux";
import Moment from 'react-moment';

class pendingWorkflow extends Component {
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
    this.props.dispatch({ type: "headerTitle", value: ((this.state.Referenceno) ? "Pending : WorkFlow - " + this.state.Referenceno : "Pending : WorkFlow")});
    let encryptedId = this.props.location.search;
    var CryptoJS = require("crypto-js");
    let bytes = CryptoJS.AES.decrypt(encryptedId.replace('?p=', ''), process.env.REACT_APP_ENCRYPT_PASSWORD);
    let Referenceno = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.setState({ Referenceno: Referenceno }, ()=> this.getApproverList())
    this.getWorkFlowList()
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

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.searchEmployee()
    }
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
      console.log(data)
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

  searchEmployeeClear = () =>{
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] ,stafflistArraySpin: "none"  })
  }

  hideFirstStaffPopup = () =>{
    this.setState({ getEmployeeFirstShow: false});
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  editApprover = (Workflowid) =>{
    this.setState({ EditWorkflowid: Workflowid, getEmployeeFirstShow: "true" })
  }

  showFirstStaffPopup = () =>{
    this.setState({ getEmployeeFirstShow: true});
  }

  handleSelectFormFields = selectedOption => {
    switch (selectedOption.id) {
      case "popupSection":
        this.setState({ popupSection: selectedOption.value })
        break;
      default: break;
    }
  }

  getStaffDetails = (id, name, Section, SectionName, Department, Division, Designation) =>{
    if(this.state.EditWorkflowid){
      this.setState({ EditRequesterId: id, EditRequesterName: name, RequesterDisplayName: id +" - "+ name, getEmployeeFirstShow: false }, ()=> this.updateApprover())
    }else{
    this.setState({ RequesterId: id, RequesterName: name, RequesterSection: Section, RequesterSectionName: SectionName, RequesterDepartment: Department, RequesterDivision: Division, RequesterDesignation: Designation, canStafNamePopover: "flex", getEmployeeFirstShow: false, RequesterDisplayName: id +" - "+ name})
    }
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
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
        this.setState({ StaffDetailslistArray: data.StaffDetails ,stafflistArraySpin: "none" })
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
                    <th scope="col"> Action </th>
                    <th scope="col"> Comments </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.getApproverListArray.map((loopdata, index) => (  
                        <tr>
                            <td> {index + 1} </td>
                            <td> {loopdata.Oriapproverid} / {loopdata.Oriapprovername} </td>
                            <td> <div className="badge badge-approver-pending">{loopdata.Wfstatus}</div> </td>
                            {(() => {
                  if (loopdata.IsEdit === 1 || loopdata.IsEdit === "1") {
                  return (
                    <td>
                      <div className="action-icons"> 
                        <i className="fa fa-pencil-square-o text-muted" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit"  onClick={() => this.editApprover(loopdata.Workflowid)} ></i>                       
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
                    <Select options={sectionOptionList} onChange={this.handleSelectFormFields}/>
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

export default connect(mapStateToProps)(pendingWorkflow);