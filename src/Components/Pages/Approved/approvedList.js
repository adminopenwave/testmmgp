import React, { Component } from 'react';
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import {toast} from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import * as FileSaver from 'file-saver';
import XLSX from "xlsx";
import ReactTooltip from 'react-tooltip';
import * as moment from 'moment';
import SimpleReactValidator from 'simple-react-validator';
import Moment from 'react-moment';

class approvedList extends Component {
  constructor(props) {
    super(props);
    this.validator1 = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
      MyApplicationList: [],
      loading: "",
      downloadExcel: [], 
      cancelPopup: false,
      downloadExcelArray: [], 
      isdownloadExcelFirstLoadDone: 0, 
      cancelReferenceno: "",
      Remarks: "",
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "My Application : Approved List" })
    this.GetListData('Approved')
  }
  handleChange = (e) => {
    switch (e.target.name) {
      case "Remarks":
        this.setState({ Remarks: e.target.value })
        break;
        default: break;
      }
  }
  GetListData = (val) => {
    let postData = { UserId: this.props.UserId, Status: val }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/MyApplication/GetMyApplicationList', {
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
        this.setState({ MyApplicationList: data.MyApplicationList, loading: "Yes" })
      }
    })
  }

  viewRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/approved/view?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  printRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/approved/print?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  viewGGPForm = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/approved/viewggpform?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  workflowRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/approved/workflow?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  cancelRequestPopup = (Referenceno) =>{
    this.setState({ cancelReferenceno: Referenceno, cancelPopup: true })
  }

  cancelThisRequest = () =>{
    this.setState({ cancelReferenceno: "", cancelPopup: false })
  }
  
  cancelRequest = () =>{
    if (this.validator1.allValid()) {
    let postData = { 
      Referenceno: this.state.cancelReferenceno ,
      Comments: this.state.Remarks
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/CancelGGPRequest', {
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
        this.setState({ cancelReferenceno: "", Remarks: "",cancelPopup: false })
        toast.success("Request Cancelled successfully.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.GetListData('Approved')
      }
    })
  }
  else {
    this.validator1.showMessages();
    this.forceUpdate();
  }
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
        header8: "GGP Status",
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
            value.data[7],
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }else{
      (async () => {
        await this.state.MyApplicationList.forEach((value,index) =>{
          let mdData = [
            value.ggp_reference_no,
            value.goods_type,
            value.goods_category,
            value.requester,
            value.exit_time,
            value.submitted_date,
            value.approval_status,
            value.ggpstatus,
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const filename = "approved.xlsx";
    
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
  

  render() {
    
    let dataArray = [];
    this.state.MyApplicationList.map((data) => {
      let mdData = [
        data.ggp_reference_no,
        data.goods_type,
        data.goods_category,
        data.requester,
        data.exit_time,
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy HH:mm:ss") : ""),
        data.approval_status,
        data.ggpstatus,
        data.ggp_reference_no,
        data.goods_type,
        data.goods_category,
        data.requester,
        data.exit_time,
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy") : ""),
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy HH:mm:ss") : ""),
        data.approval_status,
        data.ggpstatus,
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
        name: "ggp_status",
        label: "GGP Status",
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
              <div className="badge badge-approved">{value}</div>
            );
          }
        }
       },
       {
        name: "ggp_status",
        label: "GGP Status",
        options: {
         filter: false,         
         sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="badge badge-approved">{value}</div>
            );
          }
        }
       },
       
       {
        name: "action",
        label: "Action",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
                if(value.ggpstatus){
                  return(
                    <>
                 <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/print-pdf.svg"} alt="View GGP Form" onClick={() => this.viewGGPForm(value.ggp_reference_no)} data-tip="View GGP Form"/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/awesome-eye.svg"} alt="View" onClick={() => this.viewRequest(value.ggp_reference_no)} data-tip="View"/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/metro-flow-tree.svg"}  data-tip="WorkFlow"  alt="Metro Flow Tree" onClick={() => this.workflowRequest(value.ggp_reference_no)}/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/print-standard-pdf.svg"} alt="Standard Print" onClick={() => this.printRequest(value.ggp_reference_no)} data-tip="Standard Print"/>
                    </>
                  )
                }
                else{
                return(
                  <>
                 <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/print-pdf.svg"} alt="View GGP Form" onClick={() => this.viewGGPForm(value.ggp_reference_no)} data-tip="View GGP Form"/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/awesome-eye.svg"} alt="View" onClick={() => this.viewRequest(value.ggp_reference_no)} data-tip="View"/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/metro-flow-tree.svg"}  data-tip="WorkFlow"  alt="Metro Flow Tree" onClick={() => this.workflowRequest(value.ggp_reference_no)}/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/print-standard-pdf.svg"} alt="Standard Print" onClick={() => this.printRequest(value.ggp_reference_no)} data-tip="Standard Print"/>
                <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/ionic-md-close.svg"} data-tip="Cancel" alt="Close" onClick={() => this.cancelRequestPopup(value.ggp_reference_no)}/>
                  </>
                )
                }

          }
        }
       },
     ];
     const options = {
      filterType: 'checkbox',
      download: false,
      print: false,
      textLabels: {
        body: {
            noMatch: this.state.loading ? 'Sorry, there is no matching data to display' :
            <Spinner animation="border" variant="primary" style={{margin: "auto" }} />,
        },
      },
      onTableChange: (action, tableState) => {
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
      },
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
      }
    };
     
    return (
       <>
        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>My Application : Approved List</Breadcrumb.Item>
        </Breadcrumb>
        <MUIDataTable
          title={""}
          data={dataArray}
          columns={columns}
          options={options}
        />
       <Modal show={this.state.cancelPopup}>  
          <Modal.Header >Cancel Confirmation</Modal.Header>  
          <Modal.Body>
            <div className="alert alert-danger" role="alert">
            Are you sure you want to cancel this request?
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
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.cancelThisRequest}> No </Button> 
              <Button className="btn btn-primary-01 ml-3" onClick={this.cancelRequest}> Yes </Button>  
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

export default connect(mapStateToProps)(approvedList);