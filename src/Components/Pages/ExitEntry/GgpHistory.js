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
class GgpHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GGPHistoryList: [], 
      deletePopup: false,
      deleteReferenceno: "",
      loading: "",
      downloadExcel: [], 
      downloadExcelArray: [], 
      isdownloadExcelFirstLoadDone: 0, 
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "Reports : GGP History" })
    this.GetGGPHistoryListData()
  }

  GetGGPHistoryListData = () => {
    let postData = { 
      Outinspectedby: "",
      Outverifiedby: "",
      Referenceno: "",
      Ggpstatus: "",
      Returndate: "",
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
        this.setState({ GGPHistoryList: data.GGPReportList, loading: "Yes" })
      }
    })
  }

  downloadExcelFile = () =>{
    const Heading = [
      {
        header1: "Reference No",
        header2: "Verified By (Goods Out)",
        header3: "Date & Time (Goods Out)",
        header4: "Physical Inspected By (Goods Out)",
        header5: "Verified By (Goods In)",
        header6: "Date & Time (Goods In)",
        header7: "Goods Category",
        header8: "Current GGP Status",
        header9: "Target Return Date",
        header10: "Physical Inspected By (Goods In)",
        header11:"Verified By (goods Cancelled)",
        header12:"Date time (Cancelled)",
        header13:"Revise Order By",
        header14:"Date Time Revise Order",
        header15:"Revise Order Justification",
        header16:"Reset GGP By",
        header17:"Date Time Reset GGP",
        header18:"Reset GGP Justification",
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
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }else{
      (async () => {
        await this.state.GGPHistoryList.forEach((data,index) =>{
          let mdData = [
            data.Referenceno,
            data.Outverifiedbyname + " (" + data.Outverifiedby + ")",
            ((data.Outdatetime) ? moment(data.Outdatetime).format("DD-MM-yyyy") : "Null"),            
            data.Outinspectedbyname + " (" + data.Outinspectedby + ")",
            data.Inverifiedbyname + " (" + data.Inverifiedby + ")",
            ((data.Indatetime) ? moment(data.Indatetime).format("DD-MM-yyyy") : "Null"),
            data.Goodscategory,
            data.Ggpstatus,
            ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy") : "Null"),
            data.Ininspectedbyname,
            data.Cancelverifiedbyname,
            ((data.Cancelleddate) ? moment(data.Cancelleddate).format("DD-MM-yyyy") : "Null"),
            data.Reviseverifiedbyname,
            ((data.Reviseorderdate) ? moment(data.Reviseorderdate).format("DD-MM-yyyy") : "Null"),
            data.Reviseorderreason,
            data.Cancelinspectedbyname,
            ((data.Cancelleddate) ? moment(data.Cancelleddate).format("DD-MM-yyyy") : "Null"),
            data.Cancelledreason,
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const filename = "ggp_history.xlsx";
    
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
    this.state.GGPHistoryList.map((data) => {
      let mdData = [
        data.Referenceno,
        ((data.Outverifiedbyname) ? data.Outverifiedbyname + " (" + data.Outverifiedby + ")" : "Null"),
        ((data.Outdatetime) ? moment(data.Outdatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        ((data.Outinspectedbyname) ? data.Outinspectedbyname + " (" + data.Outinspectedby + ")" : "Null"),
        ((data.Inverifiedbyname) ? data.Inverifiedbyname + " (" + data.Inverifiedby + ")" : "Null"),
        ((data.Indatetime) ? moment(data.Indatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Goodscategory,
        data.Ggpstatus,
        ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy") : "Null"),
        data.Ininspectedbyname,
        data.Cancelverifiedbyname,
        ((data.Cancelleddate) ? moment(data.Cancelleddate).format("DD-MM-yyyy HH:mm:ss") : "Null"),        
        data.Reviseverifiedby,
        ((data.Reviseorderdate) ? moment(data.Reviseorderdate).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Reviseorderreason,
        data.Cancelinspectedbyname,
        data.Cancelleddate,
        data.Cancelledreason,

        data.Referenceno,
        ((data.Outverifiedbyname) ? data.Outverifiedbyname + " (" + data.Outverifiedby + ")" : "Null"),
        ((data.Outdatetime) ? moment(data.Outdatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        ((data.Outinspectedbyname) ? data.Outinspectedbyname + " (" + data.Outinspectedby + ")" : "Null"),
        ((data.Inverifiedbyname) ? data.Inverifiedbyname + " (" + data.Inverifiedby + ")" : "Null"),
        ((data.Indatetime) ? moment(data.Indatetime).format("DD-MM-yyyy HH:mm:ss") : "Null"),
        data.Goodscategory,
        data.Ggpstatus,
        ((data.Returndate) ? moment(data.Returndate).format("DD-MM-yyyy") : "Null"),
      ];
      dataArray.push(mdData)
      return null;
    });

    const columns = [

    {
      name: "Referenceno",
      label: "Reference No",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
      },
      {
      name: "Outverifiedby",
      label: "Verified By (Goods Out)",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
      },
      {
      name: "Date",
      label: "Date & Time (Goods Out)",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
      },
      {
      name: "requester",
      label: "Physical Inspected By (Goods Out)",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      },
      },
      {
        name: "exit_time",
        label: "Verified By (Goods In)",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
      },
      {
        name: "submitted_date",
        label: "Date & Time (Goods In)",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
      },
      {
        name: "approval_status1",
        label: "Goods Category",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
      },
      {
        name: "approval_status2",
        label: "Current GGP Status",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
      },
      {
        name: "approval_status",
        label: "Target Return Date",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        },
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
          sort: false,
          display: false,
          viewColumns: false,
        }
       }, 

       {
        name: "Cancelverifiedbyname",
        label: "Reset GGP By",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        }
       }, 
       {
        name: "Cancelleddate",
        label: "Date Time Reset GGP",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        }
       }, {
        name: "Cancelledreason",
        label: "Reset GGP Justification",
        options: {
          filter: false,          
          sort: false,
          display: false,
          viewColumns: false,
        }
       }, 
      {
       name: "Referenceno",
       label: "Reference No",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       },
       editable: true
      },
      {
       name: "Outverifiedby",
       label: "Verified By (Goods Out)",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
        
       }
      },
      {
       name: "Date",
       label: "Date & Time (Goods Out)",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "requester",
       label: "Physical Inspected By (Goods Out)",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
        
       }
      },
      {
        name: "exit_time",
        label: "Verified By (Goods In)",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
         
        }
       },
       {
        name: "submitted_date",
        label: "Date & Time (Goods In)",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
         
        }
       },
       {
        name: "approval_status3",
        label: "Goods Category",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
          
        }
       },
       {
        name: "approval_status21",
        label: "Current GGP Status",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
          
        }
       },
       {
        name: "approval_status12",
        label: "Target Return Date",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
         
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
          <Breadcrumb.Item active>Reports : GGP History</Breadcrumb.Item>
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

export default connect(mapStateToProps)(GgpHistory);
