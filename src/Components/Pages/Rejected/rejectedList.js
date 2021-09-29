import React, { Component } from 'react';
import { Breadcrumb } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as FileSaver from 'file-saver';
import XLSX from "xlsx";
import ReactTooltip from 'react-tooltip';
import * as moment from 'moment';
import Moment from 'react-moment';

toast.configure();
class rejectedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      MyApplicationList: [],
      loading: "", 
      downloadExcel: [], 
      downloadExcelArray: [], 
      isdownloadExcelFirstLoadDone: 0, 
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "My Application : Rejected List" })
    this.GetListData('Rejected')
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
      if(data){
        this.setState({ MyApplicationList: data.MyApplicationList, loading: "Yes" })
      }
    })
  }

  viewRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/rejected/view?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  workflowRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/rejected/workflow?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  resubmitRequest = (Referenceno) =>{
    let postData = { 
      Referenceno: Referenceno
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/ReSubmitRequest', {
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
        toast.success("Request resubmitted successfully.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        this.props.history.push({ pathname: "/pending/list" });
      }
    })
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
        await this.state.MyApplicationList.forEach((value,index) =>{
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
    const filename = "rejected.xlsx";
    
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

  printRequest = (Referenceno) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/rejected/print?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
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
        data.ggp_reference_no,
        data.goods_type,
        data.goods_category,
        data.requester,
        data.exit_time,
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy") : ""),
        ((data.submitted_date) ? moment(data.submitted_date).format("DD-MM-yyyy HH:mm:ss") : ""),
        data.approval_status,
        data.ggp_reference_no,
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
              <div className="badge badge-approved" style={{backgroundColor:"#FEDEDE", color:"#FA6D6D"}}>{value}</div>
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
            return (
              <>
              <ReactTooltip />
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/awesome-eye.svg"} alt="View" onClick={() => this.viewRequest(value)}data-tip="View"/>
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/metro-flow-tree.svg"}  data-tip="WorkFlow"  alt="Metro Flow Tree" onClick={() => this.workflowRequest(value)}/>
              <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/print-standard-pdf.svg"} alt="Standard Print" onClick={() => this.printRequest(value)} data-tip="Standard Print"/>
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
          <Breadcrumb.Item active>My Application : Rejected List</Breadcrumb.Item>
        </Breadcrumb>
        <MUIDataTable
          title={""}
          data={dataArray}
          columns={columns}
          options={options}
        />
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

export default connect(mapStateToProps)(rejectedList);