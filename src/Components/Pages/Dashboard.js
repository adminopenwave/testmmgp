import React, { Component } from 'react';
import { connect } from "react-redux";
import Chart from 'react-apexcharts';
import FloatingButton from '../Material/FloatingButton'
import $ from 'jquery';
import Spinner from 'react-bootstrap/Spinner';
import ReactHtmlParser from "react-html-parser";
import { ControlCameraOutlined } from '@material-ui/icons';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series1: [0, 0, 0, 0],   
      series2: [0, 0],      
      options1: {
        chart: {
          type: 'donut',   
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.chartRedirect(config.w.config.labels[config.dataPointIndex])
          }
          }    
        },
        labels: [
          'Pending Return',
          'Pending Confirm Goods Return',
          'Cancelled',
          'Closed'          
        ],
        legend: {
          position: 'bottom'
       },
       dataLabels: {
        formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
        },
      },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
      },
      options2: {
        chart: {
          type: 'donut',   
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.chartRedirect(config.w.config.labels[config.dataPointIndex])
          }
          }       
        },
        labels: [
          'Returnable',
          'Non-Returnable'
        ],
        legend: {
          position: 'bottom'
       },
       dataLabels: {
        formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
        },
      },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
      },
      draft_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      revision_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      pending_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      approved_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      rejected_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      cancelled_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      pending_goods_return_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      Pending_confirm_goods_return_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      mypending_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      myapproved_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      myrejected_count: <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner animation="border" variant="primary" className="dashboard-count-spinner"/></div>,
      userRole: this.props.userType,
      isGGPStatus: "",
      isGGPCategory: "",
      dashboardGGPStatusYear: "",

      GGPStatus: <div><div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><img className="mt-2" alt="Draft" src={process.env.REACT_APP_ENV +"/assets/images/charts/disabledChart.png"} /> </div> <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}> <ul style={{verticalAlign: "bottom"}}> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle fontss"></i> Pending Return</li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle fontss"></i> Pending Confirm Goods Return</li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle fontss"></i> Cancelled</li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle fontss"></i> Closed</li> </ul> </div> </div>,


      GGPCategory: <div><div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><img className="mt-2" alt="Draft" src={process.env.REACT_APP_ENV +"/assets/images/charts/disabledChart.png"} /></div> <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}> <ul style={{verticalAlign: "bottom"}}> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", padding: "2px" }}><i class="fa fa-circle"></i> Returnable</li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", padding: "2px" }}><i class="fa fa-circle"></i> Non-Returnable</li> </ul> </div> </div>
    };
  }

  chartRedirect = (label) =>{
    if(label === "Pending Return"){
      window.location = process.env.REACT_APP_ENV +"/pendinggoodsreturn/list";
    }else if(label === "Pending Confirm Goods Return"){
      window.location = process.env.REACT_APP_ENV +"/Pendingconfirmgoodsreturn/list";
    }else if(label === "Cancelled"){
      window.location = process.env.REACT_APP_ENV +"/cancelled/list";
    }else if(label === "Closed"){
      window.location = process.env.REACT_APP_ENV +"/dashboard";
    }else if(label === "Returnable"){
      window.location = process.env.REACT_APP_ENV +"/dashboard";
    }else if(label === "Non-Returnable"){
      window.location = process.env.REACT_APP_ENV +"/dashboard";
    }
  }

  componentDidMount() {
    // alert('a')
    $('[data-toggle="tooltip"]').tooltip();
    this.props.dispatch({ type: "headerTitle", value: "Dashboard" });
    this.GetApplicationCount()
    this.GetStatusCount()
    this.GetCategoryCount()
    if(this.state.userRole === 'Approver'){
      this.GetMyTaskCount()
    }
  }

  GetApplicationCount = () => {
    let postData = { UserId: this.props.UserId }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/Dashboard/GetApplicationCount', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
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
       // console.log(data)
        this.setState({ draft_count: data.draft_count, revision_count: data.revision_count, pending_count: data.pending_count, approved_count: data.approved_count, rejected_count: data.rejected_count, cancelled_count: data.cancelled_count, pending_goods_return_count: data.pending_goods_return_count, Pending_confirm_goods_return_count: data.Pending_confirm_goods_return_count  })
      }
    })
  }

  GetMyTaskCount = () => {
    let postData = { UserId: this.props.UserId }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/Dashboard/GetMyTaskCount', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
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
       // console.log(data)
        this.setState({ 
          mypending_count: data.pending_count,
          myapproved_count: data.approved_count,
          myrejected_count: data.rejected_count
        })
      }
    })
  }

  GetStatusCount = () => {
    let postData = { 
      UserId: this.props.UserId,
      Year: this.state.dashboardGGPStatusYear
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/Dashboard/GetStatusCount', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
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
       // console.log("GetStatusCount")
       // console.log(data)
        if(data.pending_return_count > 0 || data.pending_confirm_goods_return_count > 0 || data.cancelled_count > 0 || data.closed_count > 0){
          //this.setState({ series1: [data.pending_return_count, data.pending_confirm_goods_return_count, data.cancelled_count, data.closed_count], isGGPStatus: "yes"  })
          this.setState({ GGPStatus:  <Chart options={this.state.options1} series={[data.pending_return_count, data.pending_confirm_goods_return_count, data.cancelled_count, data.closed_count]}  type="donut" height="320"/> })
        }else{
          this.setState({ GGPStatus:  <div style ={{maxHeight:"300px"}}><div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><img className="mt-2" alt="Draft" src={process.env.REACT_APP_ENV +"/assets/images/charts/disabledChart.png"} /> </div> <div style={{display: "flex", justifyContent: "center", alignItems: "center" , padding:"0px", margin:"0px" }}> <ul style={{verticalAlign: "bottom"}}> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle"></i><label style={{fontSize:"smaller"}}> Pending Return</label> </li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle"></i> <label style={{ fontSize:"smaller"}}> Pending Confirm Goods Return</label></li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle"></i> <label style={{ fontSize:"smaller"}}> Cancelled </label></li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", paddingLeft: "2px" }}><i class="fa fa-circle"></i> <label style={{ fontSize:"smaller"}}> Closed </label></li> </ul> </div> </div> })
        }
      }
    })
  }

  GetCategoryCount = () => {
    let postData = { 
      UserId: this.props.UserId,
      Year: this.state.dashboardGGPCategoryYear
    }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/Dashboard/GetCategoryCount', {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
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
        console.log(data)
        if(data.returnable_count > 0 || data.non_returnable_count > 0){
          //this.setState({ series2: [data.returnable_count, data.non_returnable_count], isGGPCategory: "yes"  })
          this.setState({ GGPCategory: <Chart options={this.state.options2} series={[data.returnable_count, data.non_returnable_count]}  type="donut" height="320"/>})
        }else{
          this.setState({ GGPCategory: <div><div style={{display: "flex", justifyContent: "center", alignItems: "center" }}><img className="mt-2" alt="Draft" src={process.env.REACT_APP_ENV +"/assets/images/charts/disabledChart.png"} /></div> <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}> <ul style={{verticalAlign: "bottom"}}> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", padding: "2px" }}><i class="fa fa-circle"></i> Returnable</li> <li style={{color: "#c7cac9", display: "inline-block", textAlign: "center", padding: "2px" }}><i class="fa fa-circle"></i> Non-Returnable</li> </ul> </div> </div>})
        }
      }
    })
  }

  mytaskPending = () =>{
    window.location = process.env.REACT_APP_ENV +"/mytask/pending/list";
  }

  mytaskApproved = () =>{
    window.location = process.env.REACT_APP_ENV +"/mytask/approved/list";
  }

  mytaskRejected = () =>{
    window.location = process.env.REACT_APP_ENV +"/mytask/rejected/list";
  }

  viewDraft = () =>{
    window.location = process.env.REACT_APP_ENV +"/draft/list";
  }

  viewRevision = () =>{
    window.location = process.env.REACT_APP_ENV +"/revision/list";
  }

  viewPending = () =>{
    window.location = process.env.REACT_APP_ENV +"/pending/list";
  }

  viewApproved = () =>{
    window.location = process.env.REACT_APP_ENV +"/approved/list";
  }

  viewRejected = () =>{
    window.location = process.env.REACT_APP_ENV +"/rejected/list";
  }

  viewCancelled = () =>{
    window.location = process.env.REACT_APP_ENV +"/cancelled/list";
  }

  handleChange = (e) => {
    switch (e.target.name) {
      case "dashboardGGPStatusYear":
        this.setState({ dashboardGGPStatusYear: e.target.value }, () => this.GetStatusCount())
        break;
      case "dashboardGGPCategoryYear":
        this.setState({ dashboardGGPCategoryYear: e.target.value }, () => this.GetCategoryCount())
        break;
      default: break;
      }
  }

  render() {
    if(this.state.userRole === 'Requester'){
      return (
          <>       
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item" aria-current="page">Dashboard</li>
                </ol>
              </nav>
              <div className="row">
                <div className="col-sm-6">
                  <div className="card-1 box-shadow-1">
                  <div className="card-heading-1 clearfix">
                    <h4 className="mb-3 float-left"> GGP Status </h4>
                      <div className="dropdown dropdown-sm float-right">
                        <div className="selectWrapper">
                          <select className="selectBox" name="dashboardGGPStatusYear" id="dashboardGGPStatusYear" onChange={this.handleChange}>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-1 border-top p-sm-2">
                     {this.state.GGPStatus}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card-1 box-shadow-1">
                  <div className="card-heading-1 clearfix">
                    <h4 className="mb-3 float-left"> GGP Category </h4>
                      <div className="dropdown dropdown-sm float-right">
                        <div className="selectWrapper">
                          <select className="selectBox" name="dashboardGGPCategoryYear" id="dashboardGGPCategoryYear" onChange={this.handleChange}>
                            <option>2021</option>
                            <option>2022</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-1 border-top p-sm-2">
                    {this.state.GGPCategory}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="heading-2"> My Application </h3>
                  <div className="card-1 box-shadow-1">
                    <div className="row no-gutters">
                      <div className="col-sm-2">
                        <div className="status-box mouse-pointer" onClick={this.viewDraft}>
                          <div className="icon-sec">
                              <img className="mt-2" style={{maxHeight:"61px"}} alt="Draft" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/drat-icon.png"} />
                          </div>
                          <div className="stat-sec w-100">
                            <p className="status-count"> {this.state.draft_count} </p>
                            <p className="status-label"> Draft </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="status-box mouse-pointer" onClick={this.viewRevision}>
                          <div className="icon-sec">
                              <img className="mt-2" style={{maxHeight:"61px"}} alt="Revision" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/revision-icon.png"} />
                          </div>
                          <div className="stat-sec w-100">
                            <p className="status-count"> {this.state.revision_count} </p>
                            <p className="status-label"> Revision </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="status-box mouse-pointer" onClick={this.viewPending}>
                          <div className="icon-sec">
                              <img className="mt-2" style={{maxHeight:"61px"}} alt="Pending" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/pending-icon.png"} />
                          </div>
                          <div className="stat-sec w-100">
                            <p className="status-count"> {this.state.pending_count} </p>
                            <p className="status-label"> Pending </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="status-box mouse-pointer" onClick={this.viewApproved}>
                          <div className="icon-sec">
                              <img className="mt-2" style={{maxHeight:"61px"}} alt="Approved" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/approved-icon.png"} />
                          </div>
                          <div className="stat-sec w-100">
                            <p className="status-count"> {this.state.approved_count} </p>
                            <p className="status-label"> Approved </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="status-box mouse-pointer" onClick={this.viewRejected}>
                          <div className="icon-sec">
                              <img className="mt-2" style={{maxHeight:"61px"}} alt="Rejected" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/rejected-icon.png"} />
                          </div>
                          <div className="stat-sec w-100">
                            <p className="status-count"> {this.state.rejected_count} </p>
                            <p className="status-label"> Rejected </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="status-box border-0 mouse-pointer" onClick={this.viewCancelled}>
                          <div className="icon-sec">
                              <img className="mt-2" style={{maxHeight:"61px"}} alt="Cancelled" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/cancelled-icon.png"} />
                          </div>
                          <div className="stat-sec w-100">
                            <p className="status-count"> {this.state.cancelled_count} </p>
                            <p className="status-label"> Cancelled </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FloatingButton/>
        </>
      );
    }else if(this.state.userRole === 'Approver'){
        return (
          <>       
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item" aria-current="page">Dashboard</li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-sm-9 order-2 order-sm-1">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="card-1 box-shadow-1">
                      <div className="card-heading-1 clearfix">
                      <h4 className="mb-3 float-left"> GGP Status </h4>
                        <div className="dropdown dropdown-sm float-right">
                          <div className="selectWrapper">
                          <select className="selectBox" name="dashboardGGPStatusYear" id="dashboardGGPStatusYear" onChange={this.handleChange}>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                          </select>
                          </div>
                        </div>
                      </div>
                      <div className="card-body-1 border-top p-sm-2">
                      {this.state.GGPStatus}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <div className="card-1 box-shadow-1">
                  <div className="card-heading-1 clearfix">
                    <h4 className="mb-3 float-left"> GGP Category </h4>
                      <div className="dropdown dropdown-sm float-right">
                        <div className="selectWrapper">
                          <select className="selectBox" name="dashboardGGPCategoryYear" id="dashboardGGPCategoryYear" onChange={this.handleChange}>
                            <option>2021</option>
                            <option>2022</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-1 border-top p-sm-2">
                    {this.state.GGPCategory}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <h3 className="heading-2"> My Application </h3>
                    <div className="card-1 box-shadow-1">
                      <div className="row no-gutters">
                        <div className="col-12 col-sm-4 col-xl-2">
                          <div className="status-box mouse-pointer" onClick={this.viewDraft}>
                            <div className="icon-sec">
                                <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/drat-icon.png"} />
                            </div>
                            <div className="stat-sec w-100">
                              <p className="status-count"> {this.state.draft_count} </p>
                              <p className="status-label"> Draft </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-xl-2">
                          <div className="status-box mouse-pointer" onClick={this.viewRevision}>
                            <div className="icon-sec">
                                <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/revision-icon.png"} />
                            </div>
                            <div className="stat-sec w-100">
                              <p className="status-count"> {this.state.revision_count} </p>
                              <p className="status-label"> Revision </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-xl-2">
                          <div className="status-box mouse-pointer" onClick={this.viewPending}>
                            <div className="icon-sec">
                                <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/pending-icon.png"} />
                            </div>
                            <div className="stat-sec w-100">
                              <p className="status-count"> {this.state.pending_count} </p>
                              <p className="status-label"> Pending </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-xl-2">
                          <div className="status-box mouse-pointer" onClick={this.viewApproved}>
                            <div className="icon-sec">
                                <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/approved-icon.png"} />
                            </div>
                            <div className="stat-sec w-100">
                              <p className="status-count"> {this.state.approved_count} </p>
                              <p className="status-label"> Approved </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-xl-2">
                          <div className="status-box mouse-pointer" onClick={this.viewRejected}>
                            <div className="icon-sec">
                                <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/rejected-icon.png"} />
                            </div>
                            <div className="stat-sec w-100">
                              <p className="status-count"> {this.state.rejected_count} </p>
                              <p className="status-label"> Rejected </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-xl-2">
                          <div className="status-box border-0 mouse-pointer" onClick={this.viewCancelled}>
                            <div className="icon-sec">
                                <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/cancelled-icon.png"} />
                            </div>
                            <div className="stat-sec w-100">
                              <p className="status-count"> {this.state.cancelled_count} </p>
                              <p className="status-label"> Cancelled </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="col-sm-3 order-1 order-sm-2">
              <div className="box-shadow-1 right-section">
                <h5 className="text-white mx-2 my-3"> My Task </h5>
                <div className="row no-gutters">
                  <div className="col-12 col-xl-6"> 
                  <div className="status-box mouse-pointer" onClick={this.mytaskPending}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/pending-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.mypending_count} </p>
                      <p className="status-label"> Pending </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-6"> 
                  <div className="status-box mouse-pointer" onClick={this.mytaskApproved}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/approved-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.myapproved_count} </p>
                      <p className="status-label"> Approved </p>
                    </div>
                    </div>
                  </div>
                  <div className="col-12 col-xl-6"> 
                  <div className="status-box mouse-pointer" onClick={this.mytaskRejected}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/rejected-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.myrejected_count} </p>
                      <p className="status-label"> Rejected </p>
                    </div>
                  </div>
                </div>
                
                </div>
                <h5 className="text-white mx-2 my-3"> Reports </h5>
                  <a href={process.env.REACT_APP_ENV +"/report/list"} className="text-white d-block roundedIcon"> 
                    <span className="material-icons-outlined">
                    description
                    </span> 
                    GGP Report  </a>
                  <a href={process.env.REACT_APP_ENV +"/exitentry/list"} className="text-white d-block roundedIcon"> 
                    <span className="material-icons-outlined"> history </span> 
                    GGP History  </a>
              </div>
            </div>
            </div>
            <FloatingButton/>
        </>
      );
    }else if(this.state.userRole === 'Security' || this.state.userRole === 'SecurityAdmin'){
      return (
        <>       
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" aria-current="page" >Dashboard</li>
            </ol>
          </nav>
          <div className="row">
      <div className="col-sm-9 order-2 order-sm-1">
        <div className="row">
          <div className="col-sm-6">
            <div className="card-1 box-shadow-1">
              <div className="card-heading-1 clearfix">
                <h4 className="mb-3 float-left"> GGP Status </h4>
                  <div className="dropdown dropdown-sm float-right">
                    <div className="selectWrapper">
                      <select className="selectBox" name="dashboardGGPStatusYear" id="dashboardGGPStatusYear" onChange={this.handleChange}>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-body-1 border-top p-sm-2">
                {this.state.GGPStatus}
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card-1 box-shadow-1">
            <div className="card-heading-1 clearfix">
              <h4 className="mb-3 float-left"> GGP Category </h4>
                <div className="dropdown dropdown-sm float-right">
                  <div className="selectWrapper">
                    <select className="selectBox" name="dashboardGGPCategoryYear" id="dashboardGGPCategoryYear" onChange={this.handleChange}>
                      <option>2021</option>
                      <option>2022</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body-1 border-top p-sm-2">
              {this.state.GGPCategory}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h3 className="heading-2"> My Application </h3>
            <div className="card-1 box-shadow-1">
              <div className="row no-gutters">
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewDraft}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/drat-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.draft_count} </p>
                      <p className="status-label"> Draft </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewRevision}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/revision-icon.png" } />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.revision_count} </p>
                      <p className="status-label"> Revision </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewPending}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/pending-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.pending_count} </p>
                      <p className="status-label"> Pending </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewApproved}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/approved-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.approved_count} </p>
                      <p className="status-label"> Approved </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewRejected}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/rejected-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.rejected_count} </p>
                      <p className="status-label"> Rejected </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box border-0 mouse-pointer" onClick={this.viewCancelled}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/cancelled-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.cancelled_count} </p>
                      <p className="status-label"> Cancelled </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div className="col-sm-3 order-1 order-sm-2">
      <div className="box-shadow-1 right-section w-100">
        <h5 className="text-white mx-2 my-3"> Security Corner </h5>
            <a href={process.env.REACT_APP_ENV +"/typeofgoods/typeofgoodsList"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined"> person_outline </span>
            Type of Goods   </a>

            <a href={process.env.REACT_APP_ENV +"/exitentry/update"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined"> timeline </span>
            GGP Exit & Entry update  </a>
            <br />
        <h5 className="text-white mx-2 my-3"> Reports </h5>
          <a href={process.env.REACT_APP_ENV +"/report/list"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined">
            description
            </span> 
            GGP Report  </a>
          <a href={process.env.REACT_APP_ENV +"/exitentry/list"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined"> history </span> 
            GGP History  </a>
      </div>
    </div>
    </div>
          <FloatingButton/>
      </>
    );
    }else if(this.state.userRole === 'SecurityOfficer' ){
      return (
        <>       
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" aria-current="page" >Dashboard</li>
            </ol>
          </nav>
          <div className="row">
      <div className="col-sm-9 order-2 order-sm-1">
        <div className="row">
          <div className="col-sm-6">
            <div className="card-1 box-shadow-1">
              <div className="card-heading-1 clearfix">
                <h4 className="mb-3 float-left"> GGP Status </h4>
                  <div className="dropdown dropdown-sm float-right">
                    <div className="selectWrapper">
                    <select className="selectBox" name="dashboardGGPStatusYear" id="dashboardGGPStatusYear" onChange={this.handleChange}>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                    </select>
                    </div>
                  </div>
                </div>
                <div className="card-body-1 border-top p-sm-2">
                {this.state.GGPStatus}
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card-1 box-shadow-1">
            <div className="card-heading-1 clearfix">
              <h4 className="mb-3 float-left"> GGP Category </h4>
                <div className="dropdown dropdown-sm float-right">
                  <div className="selectWrapper">
                    <select className="selectBox" name="dashboardGGPCategoryYear" id="dashboardGGPCategoryYear" onChange={this.handleChange}>
                      <option>2021</option>
                      <option>2022</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body-1 border-top p-sm-2">
              {this.state.GGPCategory}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h3 className="heading-2"> My Application </h3>
            <div className="card-1 box-shadow-1">
              <div className="row no-gutters">
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewDraft}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/drat-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.draft_count} </p>
                      <p className="status-label"> Draft </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewRevision}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/revision-icon.png" } />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.revision_count} </p>
                      <p className="status-label"> Revision </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewPending}>
                    <div className="icon-sec" >
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/pending-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.pending_count} </p>
                      <p className="status-label"> Pending </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewApproved}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/approved-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.approved_count} </p>
                      <p className="status-label"> Approved </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box mouse-pointer" onClick={this.viewRejected}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/rejected-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.rejected_count} </p>
                      <p className="status-label"> Rejected </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="status-box border-0 mouse-pointer" onClick={this.viewCancelled}>
                    <div className="icon-sec">
                        <img className="mt-2" style={{maxHeight:"61px"}} alt="" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/cancelled-icon.png"} />
                    </div>
                    <div className="stat-sec w-100">
                      <p className="status-count"> {this.state.cancelled_count} </p>
                      <p className="status-label"> Cancelled </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div className="col-sm-3 order-1 order-sm-2">
      <div className="box-shadow-1 right-section w-100">
        <h5 className="text-white mx-2 my-3"> Security Corner </h5>
          <a href={process.env.REACT_APP_ENV +"/exitentry/update"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined"> timeline </span>
            GGP Exit & Entry update  </a>
            <br />
        <h5 className="text-white mx-2 my-3"> Reports </h5>
          <a href={process.env.REACT_APP_ENV +"/report/list"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined">
            description
            </span> 
            GGP Report  </a>
          <a href={process.env.REACT_APP_ENV +"/exitentry/list"} className="text-white d-block roundedIcon"> 
            <span className="material-icons-outlined"> history </span> 
            GGP History  </a>
      </div>
    </div>
    </div>
          <FloatingButton/>
      </>
    );
  }else{
    return (
      <>       
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" aria-current="page">Dashboard</li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-sm-6">
              <div className="card-1 box-shadow-1">
              <div className="card-heading-1 clearfix">
                <h4 className="mb-3 float-left"> GGP Status </h4>
                  <div className="dropdown dropdown-sm float-right">
                    <div className="selectWrapper">
                    <select className="selectBox" name="dashboardGGPStatusYear" id="dashboardGGPStatusYear" onChange={this.handleChange}>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                    </select>
                    </div>
                  </div>
                </div>
                <div className="card-body-1 border-top p-sm-2">
                {this.state.GGPStatus}
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card-1 box-shadow-1">
              <div className="card-heading-1 clearfix">
                <h4 className="mb-3 float-left"> GGP Category </h4>
                  <div className="dropdown dropdown-sm float-right">
                    <div className="selectWrapper">
                      <select className="selectBox" name="dashboardGGPCategoryYear" id="dashboardGGPCategoryYear" onChange={this.handleChange}>
                        <option>2021</option>
                        <option>2022</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-body-1 border-top p-sm-2">
                {this.state.GGPCategory}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <h3 className="heading-2"> My Application </h3>
              <div className="card-1 box-shadow-1">
                <div className="row no-gutters">
                  <div className="col-sm-2">
                    <div className="status-box mouse-pointer" onClick={this.viewDraft}>
                      <div className="icon-sec">
                          <img className="mt-2" style={{maxHeight:"61px"}} alt="Draft" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/drat-icon.png"} />
                      </div>
                      <div className="stat-sec w-100">
                        <p className="status-count"> {this.state.draft_count} </p>
                        <p className="status-label"> Draft </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="status-box mouse-pointer" onClick={this.viewRevision}>
                      <div className="icon-sec">
                          <img className="mt-2" style={{maxHeight:"61px"}} alt="Revision" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/revision-icon.png"} />
                      </div>
                      <div className="stat-sec w-100">
                        <p className="status-count"> {this.state.revision_count} </p>
                        <p className="status-label"> Revision </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="status-box mouse-pointer" onClick={this.viewPending}>
                      <div className="icon-sec">
                          <img className="mt-2" style={{maxHeight:"61px"}} alt="Pending" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/pending-icon.png"} />
                      </div>
                      <div className="stat-sec w-100">
                        <p className="status-count"> {this.state.pending_count} </p>
                        <p className="status-label"> Pending </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="status-box mouse-pointer" onClick={this.viewApproved}>
                      <div className="icon-sec">
                          <img className="mt-2" style={{maxHeight:"61px"}} alt="Approved" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/approved-icon.png"} />
                      </div>
                      <div className="stat-sec w-100">
                        <p className="status-count"> {this.state.approved_count} </p>
                        <p className="status-label"> Approved </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="status-box mouse-pointer" onClick={this.viewRejected}>
                      <div className="icon-sec">
                          <img className="mt-2" style={{maxHeight:"61px"}} alt="Rejected" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/rejected-icon.png"} />
                      </div>
                      <div className="stat-sec w-100">
                        <p className="status-count"> {this.state.rejected_count} </p>
                        <p className="status-label"> Rejected </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="status-box border-0 mouse-pointer" onClick={this.viewCancelled}>
                      <div className="icon-sec">
                          <img className="mt-2" style={{maxHeight:"61px"}} alt="Cancelled" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/cancelled-icon.png"} />
                      </div>
                      <div className="stat-sec w-100">
                        <p className="status-count"> {this.state.cancelled_count} </p>
                        <p className="status-label"> Cancelled </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FloatingButton/>
    </>
  );
  }

  }
}

const mapStateToProps = state => {
  return {
    menuVisibility: state.menuVisibility,
    menuStatusHeader: state.menuStatusHeader,
    getToken: state.token,
    userType: state.userType,
    userName: state.userName,
    UserId: state.UserId,
  };
}

export default connect(mapStateToProps)(Dashboard);