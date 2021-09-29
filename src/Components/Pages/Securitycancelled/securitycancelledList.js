import React, { Component } from 'react';
import { Breadcrumb } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import FloatingButton from '../../Material/FloatingButton';
import { connect } from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import * as moment from 'moment';
import Moment from 'react-moment';

class securitycancelledList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      MyApplicationList: [],
      loading: "",
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'headerTitle', value: "My Application : Security Cancelled List" })
    this.GetListData('Security Cancelled')
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
              <div className="btn-pending">{value}</div>
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
              <img className="action-right-space" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/awesome-eye.svg"} alt="View" data-tip="View"/>
              <img className="action-right-space" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/metro-flow-tree.svg"}  data-tip="WorkFlow"  alt="Metro Flow Tree" />
              <img className="action-right-space" src={process.env.REACT_APP_ENV +"/assets/images/icons/action/ionic-md-close.svg"} alt="Close" data-tip="Cancel"/>
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
        }
     };
     
    return (
       <>
        <Breadcrumb>
          <Breadcrumb.Item href={process.env.REACT_APP_ENV +"/dashboard"}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>My Application : Security Cancelled List</Breadcrumb.Item>
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

export default connect(mapStateToProps)(securitycancelledList);