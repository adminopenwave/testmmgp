import React, { Component } from 'react';
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../../Material/FloatingButton';
import { connect } from "react-redux";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import * as FileSaver from 'file-saver';
import XLSX from "xlsx";
import ReactTooltip from 'react-tooltip';
import SimpleReactValidator from 'simple-react-validator';
import * as moment from 'moment';
import Moment from 'react-moment';

toast.configure();
class pendingList extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator1 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.validator2 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
      MyTaskList: [],  
      deletePopup: false,
      deleteReferenceno: "",
      loading: "",
      Remarks: "",
      approvePopup: false,
      Referenceno: "",
      rejectPopup: false,
      downloadExcel: [], 
      downloadExcelArray: [], 
      selectedRowsArray: [], 
      isdownloadExcelFirstLoadDone: 0, 
      detailArray: "",
      MassRemarks: "",
      isMassAction: "No",
      massApproverPopup: false,
      massRejectPopup: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "My Task : Pending List" })
    this.GetListData('Pending')
  }

  GetListData = (val) => {
    let postData = { 
      UserId: this.props.UserId,
      Status: val
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/MyTask/GetMyTaskList', {
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
        this.setState({ MyTaskList: data.MyTaskList, loading: "Yes" })
      }
    })
  }

  viewRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/mytask/pending/view?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  workflowRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/mytask/pending/workflow?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  approverRequest = () =>{
    if (this.validator1.allValid()) {
      let postData = { 
        UserId: this.props.UserId,
        ReferenceNo: this.state.Referenceno,
        WFStatus: "Approved",
        Remarks: this.state.Remarks
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
          this.GetListData('Pending');
          this.setState({ approvePopup: false, Remarks: "", detailArray: ""});
          toast.success("Request approved successfully.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        }
      })
    } else {
      this.validator1.showMessages();
      this.forceUpdate();
    }
  }

  rejectRequest = () =>{
    if (this.validator2.allValid()) {
      let postData = { 
        UserId: this.props.UserId,
        ReferenceNo: this.state.Referenceno,
        WFStatus: "Rejected",
        Remarks: this.state.Remarks
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
          this.GetListData('Pending')
          this.setState({ rejectPopup: false, Remarks: "", detailArray: ""});
          toast.success("Request rejected successfully.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        }
      })
    } else {
      this.validator2.showMessages();
      this.forceUpdate();
    }
  }  

  handleChange = (e) => {
    switch (e.target.name) {
      case "Remarks":
        this.setState({ Remarks: e.target.value })
        break;
        case "MassRemarks":
          this.setState({ MassRemarks: e.target.value })
          break;
      default: break;
      }
  }

  cancelApprove = () => {
    this.setState({ Remarks: "", approvePopup: false, detailArray: ""})
  }

  confirmApprove = (details) => {
    this.setState({ approvePopup: true, Referenceno: details.ggp_reference_no, detailArray: details});
  }

  cancelReject = () => {
    this.setState({ Remarks: "", rejectPopup: false, detailArray: ""})
  }

  confirmReject = (details) => {
    this.setState({ rejectPopup: true, Referenceno: details.ggp_reference_no, detailArray: details});
  }
 
  downloadExcelFile = () =>{
    const Heading = [
      {
        header1: "GGP Reference No",
        header2: "Goods Type",
        header3: "Goods Category",
        header4: "Requester",
        header5: "Exit Time",
        header6: "Submitted Date",
        header7: "Approval Status",
      }
    ];
    (async () => {
      await this.setState({ downloadExcelArray: [] })
    })();
    if(this.state.downloadExcel.length > 0){
      (async () => {
        await this.state.downloadExcel.forEach((value,index) =>{
          let mdData = [
            value.data[0],
            value.data[1],
            value.data[2],
            value.data[3],
            value.data[4],
            value.data[5],
            value.data[6],
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }else{
      (async () => {
        await this.state.MyTaskList.forEach((value,index) =>{
          let mdData = [
            value.ggp_reference_no,
            value.goods_type,
            value.goods_category,
            value.requester,
            value.exit_time,
            value.submitted_date,
            value.approval_status,
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const filename = "pending.xlsx";
    
    const ws = XLSX.utils.json_to_sheet(Heading, {
      skipHeader: true,
      origin: 0
    });
    XLSX.utils.sheet_add_json(ws, this.state.downloadExcelArray, {
      skipHeader: true,
      origin: -1
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename);
  }

  getSelectedRowsList = (selectedIndex) =>{
    localStorage.setItem('selectedRowsArray', JSON.stringify(selectedIndex.data));
  }
  
  massApproverRequest = () =>{
    this.setState({ MassRemarks: "", massApproverPopup: true })
  }

  cancelMassApprove = () =>{
    this.setState({ MassRemarks: "", massApproverPopup: false })
    localStorage.setItem('selectedRowsArray', "");
  }

  approverMassRequest  = () =>{
    if (this.validator.allValid()) {
      (async () => {
        const selectedIndexArray = JSON.parse(localStorage.getItem('selectedRowsArray'));
        await selectedIndexArray.forEach((value,index) =>{
          // console.log(value.index)
          // console.log(this.state.MyTaskList[value.index])
          let postData = { 
            UserId: this.props.UserId,
            ReferenceNo: this.state.MyTaskList[value.index].ggp_reference_no,
            WFStatus: "Approved",
            Remarks: this.state.MassRemarks
          }
          console.log(postData)
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
            this.GetListData('Pending');
          })
        })
      })();

      
      this.setState({ MassRemarks: "", massApproverPopup: false});
      localStorage.setItem('selectedRowsArray', "");
      toast.success("Request approved successfully.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  massRejectRequest = () =>{
    this.setState({ MassRemarks: "", massRejectPopup: true })
  }

  cancelMassReject = () =>{
    this.setState({ MassRemarks: "", massRejectPopup: false })
    localStorage.setItem('selectedRowsArray', "");
  }

  RejectMassRequest  = () =>{
    if (this.validator.allValid()) {
      (async () => {
        const selectedIndexArray = JSON.parse(localStorage.getItem('selectedRowsArray'));
        await selectedIndexArray.forEach((value,index) =>{
          console.log(value.index)
          console.log(this.state.MyTaskList[value.index])
          let postData = { 
            UserId: this.props.UserId,
            ReferenceNo: this.state.MyTaskList[value.index].ggp_reference_no,
            WFStatus: "Rejected",
            Remarks: this.state.MassRemarks
          }
          console.log(postData)
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
            this.GetListData('Pending');
          })
        })
      })();
      
      this.setState({ MassRemarks: "", massRejectPopup: false});
      localStorage.setItem('selectedRowsArray', "");
      toast.error("Request rejected successfully.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  printRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/mytask/pending/print?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  render() {
    
    let dataArray = [];
    this.state.MyTaskList.map((data, index) => {
      let mdData = [
        data.ggp_reference_no,
        data.goods_type,
        data.goods_category,
        data.requester,
        data.exit_time,
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy HH:mm:ss") : ""),
        data.approval_status,
        data.ggp_reference_no,
        data.goods_type,
        data.goods_category,
        data.requester,
        data.exit_time,
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy") : ""),
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy HH:mm:ss") : ""),
        data.approval_status,
        data,
      ];
      dataArray.push(mdData)
      return null;
    });

    const columns = [
      
      {
        name: "ggp_reference_no",
        label: "GGP Reference No",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
       },
       {
        name: "goods_type",
        label: "Goods Type",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
       },
       {
        name: "goods_category",
        label: "Goods Category",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
       },
       {
        name: "requester",
        label: "Requester",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
       },
       {
         name: "exit_time",
         label: "Exit Time",
         options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
        },
        {
         name: "submitted_date",
         label: "Submitted Date",
         options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
        },
        {
         name: "approval_status",
         label: "Approval Status",
         options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
      },
      {
       name: "ggp_reference_no",
       label: "GGP Reference No",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       },
       editable: true
      },
      {
       name: "goods_type",
       label: "Goods Type",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <div>{value}</div>
            </>
          );
        }
       }
      },
      {
       name: "goods_category",
       label: "Goods Category",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "requester",
       label: "Requester",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <div>{value}</div>
            </>
          );
        }
       }
      },
      {
        name: "exit_time",
        label: "Exit Time",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
        }
       },
       {
        name: "submitted_date",
        label: "Submitted Date",
        options: {
          filter: true,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "submitted_date",
        label: "Submitted Date",
        options: {
         filter: false,
         filterType: "dropdown",
         sort: true,
        }
       },
       {
        name: "approval_status",
        label: "Approval Status",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="badge badge-pending">{value}</div>
            );
          }
        }
       },
       {
        name: "action",
        label: "Action",
        options: {
         filter: false,
         filterType: "dropdown",
         sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
              <ReactTooltip />
               <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/Icon-feather-check.svg"} data-tip="Approve" alt="View" onClick={() => this.confirmApprove(value)}/>
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/ionic-md-close.svg"} data-tip="Reject" alt="Metro Flow Tree" onClick={() => this.confirmReject(value)}/>
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/awesome-eye.svg"} alt="View" onClick={() => this.viewRequest(value.ggp_reference_no)} data-tip="View"/>
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/metro-flow-tree.svg"}  data-tip="WorkFlow"  alt="Metro Flow Tree" onClick={() => this.workflowRequest(value.ggp_reference_no)}/>
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/print-standard-pdf.svg"} alt="Standard Print" onClick={() => this.printRequest(value.ggp_reference_no)} data-tip="Standard Print"/>
              </>
            );
          }
        }
       },
     ];
     const options = {
      filterType: 'checkbox',
      download: false,
      print: false,
      selectableRows: true,
      selectableRowsOnClick: true,
      textLabels: {
        body: {
            noMatch: this.state.loading ? 'Sorry, there is no matching data to display' :
            <Spinner animation="border" variant="primary" style={{margin: "auto" }} />,
        },
      },
      onTableChange: (action, tableState) => {
        // console.log(action)
        
        if(this.state.isdownloadExcelFirstLoadDone === 0){  
          if(action === "propsUpdate"){
            this.setState({ downloadExcel: tableState.displayData, isdownloadExcelFirstLoadDone: 1})
          }
        }
        if(action === "search" || action === "sort"){
          (async () => {
            await this.setState({ downloadExcel: [] })
          })();
          this.setState({ downloadExcel: tableState.displayData})
        }
        if(action === "rowSelectionChange"){
          this.getSelectedRowsList(tableState.selectedRows)
        }
      },
      // onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
      //     console.log(rowsSelected)
      //     this.setState({ downloadExcel: rowsSelected})
      // },
      
      customToolbar: () => {
        return (
          <>
            <button className="MuiButtonBase-root MuiIconButton-root MUIDataTableToolbar-icon-23" tabindex="0" type="button" data-testid="Download CSV-iconButton" aria-label="Download CSV" onClick={this.downloadExcelFile}>
              <span className="MuiIconButton-label">
                <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path>
                </svg>
              </span>
              <span className="MuiTouchRipple-root"></span>
            </button>
          </>
        );
      },
      customToolbarSelect: () => {
        return (
          <>
            <button type="button" className="btn btn-success massactionApprove" onClick={() => this.massApproverRequest()} ><i className="fa fa-check"></i> <span className="d-none d-sm-inline">  Approve </span> </button>
            <button type="button" className="btn btn-danger" style={{marginRight: "10px"}} onClick={() => this.massRejectRequest()}> <i class="fa fa-times"></i> <span className="d-none d-sm-inline">  Reject </span></button>
          </>
        );
      },
    };
     
    return (
       <>
        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>My Task : Pending List</Breadcrumb.Item>
        </Breadcrumb>
        <div className="MyTaskPending">
        <MUIDataTable
          title={""}
          data={dataArray}
          columns={columns}
          options={options}
        />
        </div>
        <Modal show={this.state.deletePopup}>  
          <Modal.Header >Delete Confirmation</Modal.Header>  
          <Modal.Body>
            <div className="alert alert-danger" role="alert">
              Are you sure you want to delete?
            </div>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelDelete}> No </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.confirmDelete}> Yes </Button>  
            </div>
          </Modal.Body>  
        </Modal>

        <Modal show={this.state.massApproverPopup}>  
          <Modal.Header >Mass Approve Request</Modal.Header>  
          <Modal.Body>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <label for="" className="col-form-label text-muted">
                 Remarks
                </label>
                  <textarea className="form-control" placeholder="" rows="3" name="MassRemarks" value={this.state.MassRemarks} onChange={this.handleChange}></textarea>
                  {
                    this.validator.message('Remarks', this.state.MassRemarks, 'required')
                  }
                  <small className="text-muted">Note: This remark will apply to all selected requests</small>
              </div>
            </div>
          </div>
          
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelMassApprove}> Cancel </Button> 
              <Button className="btn btn-success ml-3" onClick={this.approverMassRequest}> Approve Request</Button>  
            </div>
          </Modal.Body>  
        </Modal>

        <Modal show={this.state.massRejectPopup}>  
          <Modal.Header >Mass Reject Request</Modal.Header>  
          <Modal.Body>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <label for="" className="col-form-label text-muted">
                 Remarks
                </label>
                  <textarea className="form-control" placeholder="" rows="3" name="MassRemarks" value={this.state.MassRemarks} onChange={this.handleChange}></textarea>
                  {
                    this.validator.message('Remarks', this.state.MassRemarks, 'required')
                  }
                  <small className="text-muted">Note: This remark will apply to all selected requests</small>
              </div>
            </div>
          </div>
          
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelMassReject}> Cancel </Button> 
              <Button className="btn btn-danger ml-3" onClick={this.RejectMassRequest}> Reject Request</Button>  
            </div>
          </Modal.Body>  
        </Modal>

        <Modal show={this.state.approvePopup}>  
          <Modal.Header >Approve Request</Modal.Header>  
          <Modal.Body>
          <div class="modal-body">
            <div class="row">
              {(() => {
                if (this.state.detailArray.exit_time !== "Office Hour") {
                return (
                  <div class="col-sm-12">
                  <medium id="" class="form-text alert-text">
                  This GGP is planned to exit MMHE after office hour or during off day/public holiday. Verifying/Approving this GGP indicates that you are aware and authorized the removal of goods after office hour or during off day/public holiday.
                  </medium>
                  </div>
                )
                }
              })()}
              <div class="col-sm-6">
                <label for="" class="form-label"> GGP Reference No </label>
                <p class="form-value"> {((this.state.detailArray.ggp_reference_no) ? this.state.detailArray.ggp_reference_no : "")} </p>
              </div>
              <div class="col-sm-6">
                <label for="" class="form-label"> Goods Exit Time </label>
                <p class="form-value"> {((this.state.detailArray.exit_time) ? this.state.detailArray.exit_time : "")} </p>
              </div>
              <div class="col-sm-12">
                <label for="" class="form-label"> Description  </label>
                <p class="form-value"> {((this.state.detailArray.description) ? this.state.detailArray.description : "")} </p>
              </div>
              <div class="col-sm-12">
                <label for="" className="col-form-label text-muted">
                 Remarks
                </label>
                  <textarea className="form-control" placeholder="" rows="3" name="Remarks" value={this.state.Remarks} onChange={this.handleChange}></textarea>
                  {
                    this.validator1.message('Remarks', this.state.Remarks, 'required')
                  }
              </div>
            </div>
          </div>
          
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelApprove}> Cancel </Button> 
              <Button className="btn btn-success ml-3" onClick={this.approverRequest}> Approve Request</Button>  
            </div>
          </Modal.Body>  
        </Modal>

        <Modal show={this.state.rejectPopup}>  
          <Modal.Header >Reject Request</Modal.Header>  
          <Modal.Body>
            <div class="modal-body">
              <div class="row">
              {(() => {
                if (this.state.detailArray.exit_time !== "Office Hour") {
                return (
                  <div class="col-sm-12">
                  <medium id="" class="form-text alert-text">
                  This GGP is planned to exit MMHE after office hour or during off day/public holiday. Verifying/Approving this GGP indicates that you are aware and authorized the removal of goods after office hour or during off day/public holiday.
                  </medium>
                  </div>
                )
                }
              })()}
                <div class="col-sm-6">
                  <label for="" class="form-label"> GGP Reference No </label>
                  <p class="form-value"> {((this.state.detailArray.ggp_reference_no) ? this.state.detailArray.ggp_reference_no : "")} </p>
                </div>
                <div class="col-sm-6">
                  <label for="" class="form-label"> Goods Exit Time </label>
                  <p class="form-value"> {((this.state.detailArray.exit_time) ? this.state.detailArray.exit_time : "")} </p>
                </div>
                <div class="col-sm-12">
                  <label for="" class="form-label"> Description  </label>
                  <p class="form-value"> {((this.state.detailArray.description) ? this.state.detailArray.description : "")} </p>
                </div>
                <div class="col-sm-12">
                  <label for="" className="col-form-label text-muted">
                  Remarks
                  </label>
                  <textarea className="form-control" placeholder="" rows="3" name="Remarks" value={this.state.Remarks} onChange={this.handleChange}></textarea>
                  {
                    this.validator2.message('Remarks', this.state.Remarks, 'required')
                  }
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelReject}> Cancel </Button> 
              <Button className="btn btn-danger ml-3" onClick={this.rejectRequest}> Reject Request</Button>  
            </div>
          </Modal.Body>  
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

export default connect(mapStateToProps)(pendingList);