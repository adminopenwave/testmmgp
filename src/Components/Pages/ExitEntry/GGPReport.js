import React, { Component } from 'react';
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import * as FileSaver from 'file-saver';
import XLSX from "xlsx";
import * as moment from 'moment';
import Moment from 'react-moment';

toast.configure();
class GGPReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GGPReportList: [], 
      deletePopup: false,
      deleteReferenceno: "",
      loading: "",
      downloadExcel: [], 
      downloadExcelArray: [], 
      isdownloadExcelFirstLoadDone: 0, 
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "Reports : GGP Reports" })
    this.GetGGPHistoryListData()
  }

  GetGGPHistoryListData = () => {
    let postData = { 
        Requestername: "",
        Department: "",
        Referenceno: "",
        Goodscategory: "",
        Goodstype: "",
        Returndate: "",
        Datesubmitted: "",
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/ExitEntry/GetGGPReport', {
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
        this.setState({ GGPReportList: data.GGPReportList, loading: "Yes" })
      }
    })
  }

  downloadExcelFile = () =>{
    const Heading = [
      {
        header1: "GGP Reference No",
        header2: "GGP description",
        header3: "Requester Name",
        header4: "Department",
        header5: "Date Submitted",        
        header6: "Type of Goods",
        header7: "GGP Category",
        header8: "Target Date",        
        header9: "Exit time",
        header10: "Exit time Justification",
        header11: "Exit Purpose",
        header12: "Workflow status",
        header13: "Verified By (goods Out)",
        header14: "Date time (Out)",
        header15: "Physical inspection by (Out)",
        header16: "Verified By (goods In)",
        header17: "Date time (In)",
        header18: "Physical inspection by (In)",
        header19: "Verified By (goods Cancelled)",
        header20: "Date time (Cancelled)",
        header21: "Reset Justification",
        header22: "Revise Order By",
        header23: "Date Time Revise Order",
        header24: "Revise Order Justification",
        header25: "GGP Current Status",
        header26: "URL",        
        header27: "approver 1",
        header28: "approver 2",
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
            value.data[8],
            value.data[9],
            value.data[10],
            value.data[11],
            value.data[12],
            value.data[13],
            value.data[14],
            value.data[15],
            value.data[16],
            value.data[17],
            value.data[18],
            value.data[19],
            value.data[20],
            value.data[21],
            value.data[22],
            value.data[23],
            value.data[24],
            value.data[25],
            value.data[26],
            value.data[27],  
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }else{
      (async () => {
        await this.state.GGPReportList.forEach((data,index) =>{
          var CryptoJS = require("crypto-js");
          let mdData = [
            data.Referenceno,
            data.ggpdescription,
            data.Requestername,
            data.Department,
            ((data.Datesubmitted) ? moment(data.Datesubmitted).format("DD-MM-yyyy HH:mm:ss") : "Null"),
            data.Goodstype,
            data.Goodscategory,
            ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy") : "Null"),
            data.Goodsexittime,
            data.Goodsexitremarks,
            data.Exitpurpose,
            data.Wfstatus,
            data.Outverifiedbyname,
            ((data.Outdatetime) ? moment(data.Outdatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
            data.Outinspectedbyname,
            data.Inverifiedbyname,
            ((data.Indatetime) ? moment(data.Indatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
            data.Ininspectedbyname,
            data.Cancelverifiedbyname,
            ((data.Cancelleddate) ? moment(data.Cancelleddate).format("DD-MM-yyyy HH:mm:ss") : "Null"),
            data.Cancelledreason,
            data.Reviseverifiedbyname,
            ((data.Reviseorderdate) ? moment(data.Reviseorderdate).format("DD-MM-yyyy HH:mm:ss") : "Null"),
            data.Reviseorderreason,
            data.Ggpstatus,
            process.env.REACT_APP_ENV +"/ExitEntry/excelview?p="+ encodeURI(CryptoJS.AES.encrypt(JSON.stringify(data.Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString()),     
            data.approver1,
            data.approver2,

          //  ((data.Datesubmitted) ? moment(data.Datesubmitted).format("DD-MM-yyyy") : "Null"),
          //  ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy") : "Null"),
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const filename = "ggp_reports.xlsx";
    
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
    this.state.GGPReportList.map((data) => {
      var CryptoJS = require("crypto-js");
      let mdData = [
        data.Referenceno,
        data.ggpdescription,
        data.Requestername,
        data.Department,
        ((data.Datesubmitted) ? moment(data.Datesubmitted).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Goodstype,
        data.Goodscategory,
        ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy") : "Null"),
        data.Goodsexittime,
        data.Goodsexitremarks,
        data.Exitpurpose,
        data.Wfstatus,
        data.Outverifiedbyname,
        ((data.Outdatetime) ? moment(data.Outdatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Outinspectedbyname,
        data.Inverifiedbyname,
        ((data.Indatetime) ? moment(data.Indatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Ininspectedbyname,
        data.Cancelverifiedbyname,
        ((data.Cancelleddate) ? moment(data.Cancelleddate).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Cancelledreason,
        data.Reviseverifiedbyname,
        ((data.Reviseorderdate) ? moment(data.Reviseorderdate).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Reviseorderreason,
        data.Ggpstatus,
        process.env.REACT_APP_ENV +"/ExitEntry/excelview?p="+ encodeURI(CryptoJS.AES.encrypt(JSON.stringify(data.Referenceno), process.env.REACT_APP_ENCRYPT_PASSWORD).toString()),          
        data.approver1,
        data.approver2,

        ((data.Datesubmitted) ? moment(data.Datesubmitted).format("DD-MM-yyyy") : "Null"),
        ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy ") : "Null"),
      ];
      dataArray.push(mdData)
      return null;
    });

    const columns = [
      {
       name: "Referenceno",
       label: "GGP Reference No",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
        name: "ggpdescription",
        label: "GGP Description",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
        }
       },
      {
       name: "Requestername",
       label: "Requester Name",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "Date",
       label: "Department",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "requester",
       label: "Date Submitted",
       options: {
        filter: false,
        filterType: "dropdown",
        sort: true,
       }
      },
      

      {
        name: "type_of_goods",
        label: "Type of Goods",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
        }
       },
       {
        name: "ggp_category",
        label: "GGP Category",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
        }
       },
       {
        name: "target_date",
        label: "Target Date",
        options: {
         filter: false,         
         sort: true,
        }
      },
      
      {
       name: "Goodsexittime",
       label: "Exit time",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "Goodsexitremarks",
       label: "Exit time Justification",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "Exitpurpose",
       label: "Exit Purpose",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "Wfstatus",
       label: "Workflow status",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
        name: "Outverifiedbyname",
        label: "Verified By (goods Out)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Outdatetime",
        label: "Date time (Out)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },      
       {
        name: "Outinspectedbyname",
        label: "Physical inspection by (Out)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Inverifiedbyname",
        label: "Verified By (goods In)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Indatetime",
        label: "Date time (In)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Ininspectedbyname",
        label: "Physical inspection by (In)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Cancelverifiedbyname",
        label: "Verified By (goods Cancelled)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Cancelleddate",
        label: "Date time (Cancelled)",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Cancelledreason",
        label: "Reset Justification",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Reviseverifiedbyname",
        label: "Revise Order By",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Reviseorderdate",
        label: "Date Time Revise Order",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },
       {
        name: "Reviseorderreason",
        label: "Revise Order Justification",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       }, 
       {
        name: "Ggpstatus",
        label: "GGP Current Status",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
        }
       },
       {
        name: "URL",
        label: "URL",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        }
       },     
      {
       name: "approver1",
       label: "Approver 1",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "approver2",
       label: "Approver 2",
       options: {
        filter: true,
        filterType: "dropdown", 
        sort: true,
       }
      },
      
      {
        name: "requester",
        label: "Date Submitted",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
         display:false,   
         viewColumns:false,              
        }
       },
       {
        name: "target_date",
        label: "Target Date",
        options: {
         filter: true,
         filterType: "dropdown",         
         display:false,  
         viewColumns:false,       
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
          <Breadcrumb.Item active>Reports : GGP Reports</Breadcrumb.Item>
        </Breadcrumb>
        <MUIDataTable
          title={""}
          data={dataArray}
          columns={columns}
          options={options}
        />
        <p className="text-center"></p>
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

export default connect(mapStateToProps)(GGPReport);
