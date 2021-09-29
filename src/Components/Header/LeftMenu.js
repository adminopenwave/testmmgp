import React, { Component } from 'react';
import { connect } from "react-redux";
import {menuItems} from './MenuConfig';
import { createBrowserHistory } from "history";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ReactTooltip from 'react-tooltip';

const BlueOnGreenTooltip = withStyles({
  tooltip: {
    color: "#5faed4",
    backgroundColor: "white",
    fontSize: "15px",
    marginTop: "-5px"
  }
})(Tooltip);


const history = createBrowserHistory();

class LeftMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft_count: 0, revision_count: 0, pending_count: 0,   approved_count: 0,  rejected_count: 0, cancelled_count: 0, pending_goods_return_count: 0, Pending_confirm_goods_return_count: 0, 
      security_cancelled_count: 0, 
      mypending_count: 0, 
      myapproved_count: 0, 
      myrejected_count: 0, 
    };
  }

  componentDidMount() {
    this.GetApplicationCount()
    this.GetMyTaskCount()
  }

  GetApplicationCount = () => {
    let postData = { UserId: this.props.UserId }
    fetch(process.env.REACT_APP_WEB_SERVICE_URL + '/api/Dashboard/GetApplicationCount', {
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
        this.setState({ draft_count: data.draft_count, revision_count: data.revision_count, pending_count: data.pending_count, approved_count: data.approved_count, rejected_count: data.rejected_count, cancelled_count: data.cancelled_count, pending_goods_return_count: data.pending_goods_return_count, Pending_confirm_goods_return_count: data.pendig_confirm_goods_return_count, security_cancelled_count: data.security_cancelled_count  })
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
        this.setState({ 
          mypending_count: data.pending_count,
          myapproved_count: data.approved_count,
          myrejected_count: data.rejected_count
        })
      }
    })
  }
    
  _handleClick(menuItem) { 
    if(this.state.active === menuItem){
      this.setState({ active: "" });
    }else{
      this.setState({ active: menuItem });
    }
  }
  render() {
    return menuItems.map((child, index) => {
      
      if(child.isubmenu === '1'){   
        if(child.type.indexOf(this.props.userType) > -1){
        if(child.iscountrequired === '1'){
          return (
          <li className="collapsed mouse-pointer main-li" key={index + 1}>
            <ReactTooltip place="bottom"/>
            <a onClick={this._handleClick.bind(this, child.title)} className="selectedRootMenu button-link" >
              <i><img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+child.icon} alt="View" /></i>
              <span> {child.title} </span>
              <i className={(this.state.active === child.title ? 'fa fa-angle-down ' : 'fa fa-angle-right ') + (child.subpage.indexOf(history.location.pathname) > -1 ? 'fa fa-angle-down ' : 'fa fa-angle-right')} aria-hidden="true"></i>
            </a>
            <ul className={'sub-menu collapse ' + (this.state.active === child.title ? 'show ' : 'hide ') + (child.subpage.indexOf(history.location.pathname) > -1 ? 'show ' : 'hide ')}>
              {
                child.submenu.map((subchild, index2) => {
                  if(history.location.pathname === subchild.page){                  
                    return (
                        <li className="selectedSubMenu" data-tip={subchild.title} key={index2 + 10}><a href={subchild.page}>
                        <i><img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+subchild.icon} alt="View" /></i>
                          <span> {
                          (subchild.title.length >= 18) ? subchild.title.slice(0, 18) +"... " : subchild.title + " " } ({(() => {
                            if (subchild.translate+"_count" === "MENU.draft_count") {
                              return (
                                ((this.state.draft_count > 0) ? this.state.draft_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.revision_count") {
                              return (
                                ((this.state.revision_count > 0) ? this.state.revision_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.pending_count") {
                              return (
                                ((this.state.pending_count > 0) ? this.state.pending_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.approved_count") {
                              return (
                                ((this.state.approved_count > 0) ? this.state.approved_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.rejected_count") {
                              return (
                                ((this.state.rejected_count > 0) ? this.state.rejected_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.cancelled_count") {
                              return (
                                ((this.state.cancelled_count > 0) ? this.state.cancelled_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.pending_goods_return_count") {
                              return (
                                ((this.state.pending_goods_return_count > 0) ? this.state.pending_goods_return_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.Pending_confirm_goods_return_count") {
                              return (
                                ((this.state.Pending_confirm_goods_return_count > 0) ? this.state.Pending_confirm_goods_return_count : 0)
                              )
                            } else if (subchild.translate+"_count" === "MENU.security_cancelled_count") {
                              return (
                                ((this.state.security_cancelled_count > 0) ? this.state.security_cancelled_count : 0)
                              )
                            } else if (subchild.translate === "MENU.MyTask_Pending") {
                              return (
                                ((this.state.mypending_count > 0) ? this.state.mypending_count : 0)
                              )
                            } else if (subchild.translate === "MENU.MyTask_Approved") {
                              return (
                                ((this.state.myapproved_count > 0) ? this.state.myapproved_count : 0)
                              )
                            } else if (subchild.translate === "MENU.MyTask_Rejected") {
                              return (
                                ((this.state.myrejected_count > 0) ? this.state.myrejected_count : 0)
                              )
                            } else {
                              return (
                                0
                              )
                            }
                          })()}) </span></a></li>
                    );
                  }else{
                  return (
                      <li className=""  key={index2 + 12} data-tip={subchild.title}>
                          <a href={subchild.page}>
                          <i><img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+subchild.icon} alt="View" /></i>
                              <span>
                                {(subchild.title.length >= 18) ? subchild.title.slice(0, 18) +"... " : subchild.title + " " }
                                ({(() => {
                                  if (subchild.translate+"_count" === "MENU.draft_count") {
                                    return (
                                      ((this.state.draft_count > 0) ? this.state.draft_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.revision_count") {
                                    return (
                                      ((this.state.revision_count > 0) ? this.state.revision_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.pending_count") {
                                    return (
                                      ((this.state.pending_count > 0) ? this.state.pending_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.approved_count") {
                                    return (
                                      ((this.state.approved_count > 0) ? this.state.approved_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.rejected_count") {
                                    return (
                                      ((this.state.rejected_count > 0) ? this.state.rejected_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.cancelled_count") {
                                    return (
                                      ((this.state.cancelled_count > 0) ? this.state.cancelled_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.pending_goods_return_count") {
                                    return (
                                      ((this.state.pending_goods_return_count > 0) ? this.state.pending_goods_return_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.Pending_confirm_goods_return_count") {
                                    return (
                                      ((this.state.Pending_confirm_goods_return_count > 0) ? this.state.Pending_confirm_goods_return_count : 0)
                                    )
                                  } else if (subchild.translate+"_count" === "MENU.security_cancelled_count") {
                                    return (
                                      ((this.state.security_cancelled_count > 0) ? this.state.security_cancelled_count : 0)
                                    )
                                  } else if (subchild.translate === "MENU.MyTask_Pending") {
                                    return (
                                      ((this.state.mypending_count > 0) ? this.state.mypending_count : 0)
                                    )
                                  } else if (subchild.translate === "MENU.MyTask_Approved") {
                                    return (
                                      ((this.state.myapproved_count > 0) ? this.state.myapproved_count : 0)
                                    )
                                  } else if (subchild.translate === "MENU.MyTask_Rejected") {
                                    return (
                                      ((this.state.myrejected_count > 0) ? this.state.myrejected_count : 0)
                                    )
                                  } else {
                                    return (
                                      0
                                    )
                                  }
                                })()})
                              </span>
                          </a>
                      </li>
                  );
                }
                })
              }
            </ul>
          </li>
          );
          }else{
            return (
              <li className="collapsed mouse-pointer main-li"  key={index + 15} >
                <ReactTooltip place="bottom"/>
                <a onClick={this._handleClick.bind(this, child.title)} className="selectedRootMenu button-link" >
                <i><img className="action-right-space mouse-pointer" src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+child.icon} alt="View" /></i>
                  <span> {child.title} </span>
                  <i className={(this.state.active === child.title ? 'fa fa-angle-down ' : 'fa fa-angle-right ') + (child.subpage.indexOf(history.location.pathname) > -1 ? 'fa fa-angle-down ' : 'fa fa-angle-right')} aria-hidden="true"></i>
                </a>
                <ul className={'sub-menu collapse ' + (this.state.active === child.title ? 'show ' : 'hide ') + (child.subpage.indexOf(history.location.pathname) > -1 ? 'show ' : 'hide ')}>
                  {
                    child.submenu.map((subchild, index3) => {
                      if(history.location.pathname === subchild.page){                  
                        return (
                            <li className="selectedSubMenu"  key={index3 + 19} data-tip={subchild.title}><a href={subchild.page}>
                            <i><img className="action-right-space mouse-pointer"  src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+subchild.icon} alt="View" /></i>
                              <span> {
                              (subchild.title.length >= 18) ? subchild.title.slice(0, 18) +"..." : subchild.title } </span></a></li>
                        );
                      }else{
                      return (
                          <li className="" key={index3 + 22} data-tip={subchild.title}>
                              <a href={subchild.page}>
                              <i><img className="action-right-space mouse-pointer"  src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+subchild.icon} alt="View" /> </i>
                                  <span>
                                    {(subchild.title.length >= 18) ? subchild.title.slice(0, 18) +"..." : subchild.title }
                                  </span>
                              </a>
                          </li>
                      );
                    }
                    })
                  }
                </ul>
              </li>
              );
          }
        }
     }else{
      if(child.type.indexOf(this.props.userType) > -1){
        if(history.location.pathname === child.page){
          return (
            
              <li className="selectedSubMenu" key={index + 24}><a href={child.page}>
              <i><img className="action-right-space mouse-pointer"  src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+child.icon} alt="View" /> </i>
                <span> {child.title} </span></a></li>
          );
        }else{
          return (
              <li className="" key={index + 26}><a href={child.page} >
              <i><img className="action-right-space mouse-pointer"  src={process.env.REACT_APP_ENV +"/assets/images/icons/status/"+child.icon} alt="View" /></i>
                <span> {child.title} </span></a></li>
          );
        }
     }
    }
   });
  }
}

 
const mapStateToProps = state => {
  return {
    menuVisibility: state.menuVisibility,
    getToken: state.token,
    userType: state.userType,
    userName: state.userName,
    UserId: state.UserId,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    openMenu: () => dispatch({type:'openMenu', value: this.props.menuVisibility}),
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);