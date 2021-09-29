import React, { Component } from 'react';
import { Button, Modal, Breadcrumb } from "react-bootstrap";
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import ReactTooltip from 'react-tooltip';
import * as moment from 'moment';
import Moment from 'react-moment';
import XLSX from "xlsx";
import * as FileSaver from 'file-saver';

toast.configure();
class TypeofgoodsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listArray: [],
      deletePopup: false,
      deleteId: "",
      loading: "",
      downloadExcel: [], 
      downloadExcelArray: [], 
      isdownloadExcelFirstLoadDone: 0, 
    };
    
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "Type Of Goods" })
    this.GetListData()
  }

  GetListData = (val) => {
    // alert('a')
    let postData = { ID: '0' }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/GGP/GetGoodsTypes', {
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
      console.log(data.GoodsTypeList.Modifieddate)
      console.log(data.GoodsTypeList)
      if(data){
        this.setState({ listArray: data.GoodsTypeList, loading: "Yes" })
      }
    })
  }

  deleteRecord = (id) =>{
    this.setState({ deletePopup: true, deleteId: id });
  }

  cancelDelete = () =>{
    this.setState({ deletePopup: false, deleteId: "" });
  }

  confirmDelete = () =>{
    this.setState({ deletePopup: false });
    let postData = { ID: this.state.deleteId, Mode: "Delete" }
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
      if(data){
        this.GetListData();
        this.setState({ deleteId: "" });
        toast.success("Deleted successfully.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    })
  }

  // editGoods = (id) =>{
  //   var CryptoJS = require("crypto-js");
  //   window.location = process.env.REACT_APP_ENV +"/typeofgoods/edit?p=" + id;
  // }

  editGoods = (id) =>{
    var CryptoJS = require("crypto-js");
    window.location = process.env.REACT_APP_ENV +"/typeofgoods/edit?p=" + encodeURI(CryptoJS.AES.encrypt(JSON.stringify(id), process.env.REACT_APP_ENCRYPT_PASSWORD).toString());
  }

  downloadExcelFile = () =>{
    const Heading = [
      {
        header1: "Type of Goods",
        header2: "Verifier",
        header3: "Approver",
        header4: "Modified By",
        header5: "Modified On",
        header6: "Status",
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
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }else{
      (async () => {
        await this.state.listArray.forEach((value,index) =>{
          let mdData = [
            value.Goodstype,
            value.Verifiername,
            value.Approvername,
            value.Modifiedbyname,
            ((data.Modifieddate) ? moment(data.Modifieddate).format("DD-MM-yyyy HH:mm:ss") : ""),
            value.Active,
          ];
          this.state.downloadExcelArray.push(mdData)
          return null;
        })
      })();
    }

    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const filename = "type_of_goods.xlsx";
    
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
    this.state.listArray.map((data) => {
      let mdData = [
        data.Goodstype,
        data.Verifiername,
        data.Approvername,
        data.Modifiedbyname,
        ((data.Modifieddate) ? moment(data.Modifieddate).format("DD-MM-yyyy HH:mm:ss") : ""),     
        data.Active,
        data.Active,
        data.ID,
      ];
      dataArray.push(mdData)
      return null;
    });

    const columns = [
      {
       name: "Goodstype",
       label: "Type of Goods",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       },
       editable: true
      },
      {
       name: "Verifiername",
       label: "Verifier",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
       name: "Approvername",
       label: "Approver",
       options: {
        filter: true,
        filterType: "dropdown",
        sort: true,
       }
      },
      {
        name: "modified_by",
        label: "Modified By",
        options: {
          filter: true,
          filterType: "dropdown",
          sort: true,
         }
        },
       {
        name: "Modifieddate",
        label: "Modified On",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
        },
        editable: true
       },
       {
        name: "status",
        label: "Status",
        options: {
          filter: false,
          filterType: "dropdown",
          sort: false,
          display: false,
          viewColumns: false,
        },
        editable: true
       },
       {
        name: "status",
        label: "Status",
        options: {
         filter: true,
         filterType: "dropdown",
         sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
                {(value === 'Active') ? (
                  <div className="badge badge-approved">{value}</div>
                ) : (
                  <div className="badge badge-rejected">{value}</div>
                )}
              </>
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
          //  console.log(value.ID)
            return (
              <>
              <ReactTooltip />
               <img className="action-right-space mouse-pointer" style={{width: "25px"}} src={process.env.REACT_APP_ENV +"/assets/images/icons/action/edit-solid.svg"} data-tip="Edit" onClick={() => this.editGoods(value)}data-tip="View"/>

               <img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/ionic-md-close.svg"} data-tip="Delete" alt="Close" onClick={() => this.deleteRecord(value)}/>
             
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
        //  console.log("onTableChange");
        //  console.log(action);
        //  console.log(this.state.isdownloadExcelFirstLoadDone);
          if(this.state.isdownloadExcelFirstLoadDone === 0){  
           // console.log(action);
            if(action === "propsUpdate"){
            //  console.log(tableState.displayData);
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

        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>Type Of Goods</Breadcrumb.Item>
        </Breadcrumb>
      
      <div className="text-right mb-3">
      <Link to="/typeofgoods/create"><button type="button" className="btn btn-primary"> + Add</button></Link>
      </div>
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

export default connect(mapStateToProps)(TypeofgoodsList);