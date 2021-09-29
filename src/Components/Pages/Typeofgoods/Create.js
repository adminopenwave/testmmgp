import React, { Component } from "react";
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import { connect } from "react-redux";
import FloatingButton from '../../Material/FloatingButton';
import Select from 'react-select';
import 'bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import SimpleReactValidator from 'simple-react-validator';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
class Create extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
      getVerifierEmployeeShow:false,
      getApproverEmployeeShow:false,
      SectionlistArray: [],
      StaffDetailslistArray: [],
      popupEmployeeId: "",
      popupEmployeeName: "",
      popupSection: "",
      Goodstype: "",
      Verifierid: "",
      Verifiername: "",
      Approverid: "",
      Approvername: "",
      Active: "Active",
      Modifiedby: this.props.UserId,
      canRemoveVerifier: "none",
      stafflistArraySpin : "none",
    };
  }

  componentDidMount() {
    // alert(this.props.UserId)
    this.props.dispatch({ type: "headerTitle", value: "Type Of Goods: Create" });
    this.GetSectionListData()
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
        if(data.Verifierid){
          this.setState({ 
            canRemoveVerifier: "",
           })
          }else{
            this.setState({ 
              canRemoveVerifier: "none",
             })
          }
      }
    })
  }

  getVerifiershow = () =>{
    this.setState({getVerifierEmployeeShow:true})
  }

  getVerifierhide = () =>{
    this.setState({getVerifierEmployeeShow:false})
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  getApprovershow = () =>{
    this.setState({getApproverEmployeeShow:true})
  }

  getApproverhide = () =>{
    this.setState({getApproverEmployeeShow:false})
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
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
        // alert(e.target.value)
        // alert(e.target.name)
        this.setState({ Active: e.target.value })
        break;
      default: break;
      }
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
  searchEmployeeapprover = () => {
    // alert('a')
    this.setState({stafflistArraySpin: "", StaffDetailslistArray:[]})
    let postData = { 
        EmployeeId: this.state.popupEmployeeId,
        Name: this.state.popupEmployeeName,
        Section: this.state.popupSection,        
        EmployeeType:"Approver",

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
        this.setState({ StaffDetailslistArray: data.StaffDetails, stafflistArraySpin: "none"  })
      }
    })
  }

  searchEmployeeClear = () =>{
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] ,stafflistArraySpin: "none"  })
  }

  getVerifierDetails = (id, name) =>{
    this.setState({ Verifierid: id, Verifiername: name, getVerifierEmployeeShow: false, canRemoveVerifier: "" })
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  getApproverDetails = (id, name) =>{
    this.setState({ Approverid: id, Approvername: name, getApproverEmployeeShow: false })
    this.setState({ popupEmployeeId: "", popupEmployeeName: "", popupSection: "", StaffDetailslistArray: [] })
  }

  create = () =>{
    if (this.validator.allValid()) {
      let postData = { 
        Mode: "Add",
        Goodstype: this.state.Goodstype,
        Verifierid: this.state.Verifierid,
        Verifiername: this.state.Verifiername,
        Approverid: this.state.Approverid,
        Approvername: this.state.Approvername,
        Active: this.state.Active,
        Modifiedby: this.state.Modifiedby,
      }
      fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/InsertUpdateGoodsType', {
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
          if(data.Status === "Success"){
            toast.success("Created successfully.", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
            this.props.history.push({ pathname: "/typeofgoods/typeofgoodsList" });
          }else{
            toast.error(data.Message, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          }
        }
      })
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  cancleForm = () =>{
    this.props.history.push({ pathname: "/typeofgoods/typeofgoodsList" });
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.searchEmployee()
    }
  }
  
  _handleKeyDownapprover = (e) => {
    if (e.key === 'Enter') {
      this.searchEmployeeapprover()
    }
  }
  
  removeVerifire = () =>{
    this.setState({Verifierid:"", Verifiername:"", canRemoveVerifier:"none"})
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
       <Modal show={this.state.getVerifierEmployeeShow} size="lg">  
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
                      <tr onClick={()=>this.getVerifierDetails(staff.EmployeeId, staff.Name)} className="cursor-pointer">  
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
          <Button className="btn btn-light" onClick={()=>this.getVerifierhide()}>Close</Button>  
        </Modal.Footer>  
      </Modal>

      <Modal show={this.state.getApproverEmployeeShow} size="lg">  
        <Modal.Header >Employee Look Up</Modal.Header>  
        <Modal.Body>
          <section className="p-3">
            <div className="form-group row mb-1">
              <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Employee Id
              </label>
              <div className="col-sm-4">
                <div className="form-group">
                  <input type="number" className="form-control" name="popupEmployeeId" value={this.state.popupEmployeeId} onChange={this.handleChange} onKeyDown={this._handleKeyDownapprover}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="auth-name" className="col-sm-3 col-form-label text-muted">
                Employee Name
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <input type="text" className="form-control" name="popupEmployeeName" value={this.state.popupEmployeeName} onChange={this.handleChange} onKeyDown={this._handleKeyDownapprover}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="auth-cat" className="col-sm-3 col-form-label text-muted">
                Section
              </label>
              <div className="col-sm-6">
                <div className="form-group">
                  <Select options={sectionOptionList} onChange={this.handleSelectFormFields} onKeyDown={this._handleKeyDownapprover}/>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={()=>this.searchEmployeeClear()}> Clear </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.searchEmployeeapprover}> Search </Button>  
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
                      <tr onClick={()=>this.getApproverDetails(staff.EmployeeId, staff.Name)} className="cursor-pointer">  
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
          <Button className="btn btn-light" onClick={()=>this.getApproverhide()}>Close</Button>  
        </Modal.Footer>  
      </Modal>


        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/typeofgoods/typeofgoodsList"}>Type Of Goods</Breadcrumb.Item>
          <Breadcrumb.Item active>Create</Breadcrumb.Item>
        </Breadcrumb>
        
        <div className="content-area shadow p-3 mb-5 bg-white rounded">
          <section className="p-3">
           <div className="form-group row">
              <label for="" className="col-sm-2 col-form-label text-muted">
                Type Of Goods
              </label>
              <div className="col-sm-4">
                <div className="input-group mb-2 mr-sm-2">
                  <input type="text" className="form-control" id="" placeholder="" name="Goodstype" value={this.state.Goodstype} onChange={this.handleChange}/>
                </div>
                {
                  this.validator.message('Type Of Goods', this.state.Goodstype, 'required')
                }
              </div>
            </div>
            <div className="form-group row mb-2">
              <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                Verifier
              </label>
              <div className="col-sm-2">
                <div className="form-group">
                  <input type="text" className="form-control" readOnly={true} onClick={this.getVerifiershow} value={this.state.Verifierid}/>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                <div className="input-group mb-2 mr-sm-2" >
                  <input type="text" onClick={this.getVerifiershow}className="form-control" id="" placeholder="" readOnly={true} value={this.state.Verifiername}/>
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-search text-muted" onClick={this.getVerifiershow}> </i>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ml-2 mt-2" style={{display: this.state.canRemoveVerifier}}>
                  <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/ionic-md-close.svg"} data-tip="Remove" alt="Remove" onClick={this.removeVerifire}/>
                </div>
              </div>
            </div>
            <div className="form-group row mb-2">
              <div className="col-sm-2"> </div>
              <div className="col-sm-5">
                {/*
                  this.validator.message('Verifier', this.state.Verifierid, 'required')
                */}
              </div>
            </div>
            <div className="form-group row mb-2">
              <label for="auth-name" className="col-sm-2 col-form-label text-muted">
                Approver {" "}
              </label>
              <div className="col-sm-2">
                <div className="form-group">
                  <input type="text" className="form-control" readOnly={true} onClick={this.getApprovershow} value={this.state.Approverid}/>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                <div className="input-group mb-2 mr-sm-2" >
                  <input type="text" onClick={this.getApprovershow} className="form-control" id="" placeholder="" readOnly={true} value={this.state.Approvername}/>
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
                  this.validator.message('Approver', this.state.Approverid, 'required')
                }
              </div>
            </div>
            <div className="form-group row mb-2">
              <label for="auth-cat" className="col-sm-2 col-form-label text-muted">
               Status {" "}
              </label>
              <div className="col-sm-2">
                <div className="form-group">
                  <select className="form-control classic classicSelect" name="Active" value={this.state.Active} onChange={this.handleChange}>
                    <option value="Active">Active</option>
                    <option value="In-Active">In-Active</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="text-center text-sm-right">
              <button className="btn btn-light" type="button" onClick={this.cancleForm}>
                Cancel
              </button>
              <button className="btn btn-primary-01 ml-3 float-right float-sm-none" type="button" onClick={() => this.create()}>
                <span className="d-none d-sm-inline">  Save </span> {" "}
              </button>
            </div>
          </section>
        </div>
        <FloatingButton />
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

export default connect(mapStateToProps)(Create);
