import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import Dashboard from '../Pages/Dashboard';
import Login from '../Pages/Login';
import ChangeUser from '../Pages/ChangeUser';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header/Header';
import draftList from '../Pages/Draft/draftList';
import draftPrint from '../Pages/Draft/printRequest';
import draftView from '../Pages/Draft/draftView';
import draftEdit from '../Pages/Draft/draftEdit';
import draftEditApproverList from '../Pages/Draft/draftEditApproverList';
import revisionList from '../Pages/Revision/revisionList';
import revisionView from '../Pages/Revision/revisionView';
import revisionPrint from '../Pages/Revision/printRequest';
import revisionWorkflow from '../Pages/Revision/revisionWorkflow';
import revisionEdit from '../Pages/Revision/revisionEdit';
import revisionEditApproverList from '../Pages/Revision/revisionEditApproverList';
import pendingList from '../Pages/Pending/pendingList';
import pendingPrint from '../Pages/Pending/printRequest';
import pendingView from '../Pages/Pending/pendingView';
import pendingWorkflow from '../Pages/Pending/pendingWorkflow';
import approvedList from '../Pages/Approved/approvedList';
import approvedPrint from '../Pages/Approved/printRequest';
import approvedView from '../Pages/Approved/approvedView';
import approvedviewGGPForm from '../Pages/Approved/viewGGPForm';
import approvedWorkflow from '../Pages/Approved/approvedWorkflow';
import rejectedList from '../Pages/Rejected/rejectedList';
import rejectedPrint from '../Pages/Rejected/printRequest';
import rejectedView from '../Pages/Rejected/rejectedView';
import rejectedWorkflow from '../Pages/Rejected/rejectedWorkflow';
import cancelledList from '../Pages/Cancelled/cancelledList';
import cancelledPrint from '../Pages/Cancelled/printRequest';
import cancelledView from '../Pages/Cancelled/cancelledView';
import cancelledWorkflow from '../Pages/Cancelled/cancelledWorkflow';
import pendinggoodsreturnList from '../Pages/Pendinggoodsreturn/pendinggoodsreturnList';
import pendinggoodsreturnPrint from '../Pages/Pendinggoodsreturn/printRequest';
import pendinggoodsreturnView from '../Pages/Pendinggoodsreturn/pendinggoodsreturnView';
import pendinggoodsreturnWorkflow from '../Pages/Pendinggoodsreturn/pendinggoodsreturnWorkflow';
import pendingconfirmgoodsreturnList from '../Pages/pendingconfirmgoodsreturn/pendingconfirmgoodsreturnList';
import pendingconfirmgoodsreturnPrint from '../Pages/pendingconfirmgoodsreturn/printRequest';
import pendingconfirmgoodsreturnView from '../Pages/pendingconfirmgoodsreturn/pendingconfirmgoodsreturnView';
import pendingconfirmgoodsreturnWorkflow from '../Pages/pendingconfirmgoodsreturn/pendingconfirmgoodsreturnWorkflow';
import securitycancelledList from '../Pages/Securitycancelled/securitycancelledList';
import CreateRequest from '../Pages/CreateRequest/CreateRequest';
import ApproverList from '../Pages/CreateRequest/ApproverList';
import TypeofgoodsList from '../Pages/Typeofgoods/TypeofgoodsList';
import Typeofgoodscreate from '../Pages/Typeofgoods/Create';
import Typeofgoodsedit from '../Pages/Typeofgoods/Edit';
import MyTaskapprovedList from '../Pages/MyTask/Approved/approvedList';
import MyTaskapprovedPrint from '../Pages/MyTask/Approved/printRequest';
import MyTaskapprovedView from '../Pages/MyTask/Approved/approvedView';
import MyTaskapprovedWorkflow from '../Pages/MyTask/Approved/approvedWorkflow';
import MyTaskpendingList from '../Pages/MyTask/Pending/pendingList';
import MyTaskpendingPrint from '../Pages/MyTask/Pending/printRequest';
import MyTaskpendingView from '../Pages/MyTask/Pending/pendingView';
import MyTaskpendingWorkflow from '../Pages/MyTask/Pending/pendingWorkflow';
import MyTaskrejectedList from '../Pages/MyTask/Rejected/rejectedList';
import MyTaskrejectedPrint from '../Pages/MyTask/Rejected/printRequest';
import MyTaskrejectedView from '../Pages/MyTask/Rejected/rejectedView';
import MyTaskrejectedWorkflow from '../Pages/MyTask/Rejected/rejectedWorkflow';
import MailActions from '../Pages/MailActions/Actions';
import MailActionsviewRequest from '../Pages/MailActions/viewRequest';
import Exitentryupdate from '../Pages/ExitEntry/Exitentryupdate';
import Exitentryview from '../Pages/ExitEntry/View';
import GgpHistory from '../Pages/ExitEntry/GgpHistory';
import GGPReport from '../Pages/ExitEntry/GGPReport';
import printRequest from '../Pages/printRequest';
import pendingEdit from '../Pages/Pending/pendingEdit';
import pendingApproverList from '../Pages/Pending/pendingApproverList';
import ExcelView from '../Pages/ExitEntry/ExcelView';

class Routers extends Component{
  render(){
    if (!this.props.UserId || !this.props.userType) {
      return (
      <BrowserRouter>
        <Redirect to="/login" />
        <Route path="/login"  component={Login} />
      </BrowserRouter>
      )
    }
    return (
      <BrowserRouter>
        <Header/>
          <div className={`main ${this.props.menuStatusHeader}`}>
            <Switch>
              <Route exact path="/" render={() => { return ( <Redirect to="/dashboard" />) }}/>
              <Route exact path="/login" render={() => { return ( <Redirect to="/dashboard" />) }}/>
              <Route path="/changeuser"  component={ChangeUser} />
              <Route path="/dashboard"  component={Dashboard} />
              <Route path="/draft/list"  component={draftList} />
              <Route path="/draft/print"  component={draftPrint} />
              <Route path="/draft/view"  component={draftView} />
              <Route path="/draft/edit"  component={draftEdit} />
              <Route path="/draft/editapproverlist"  component={draftEditApproverList} />
              <Route path="/revision/list"  component={revisionList} />
              <Route path="/revision/view"  component={revisionView} />
              <Route path="/revision/print"  component={revisionPrint} />
              <Route path="/revision/workflow"  component={revisionWorkflow} />
              <Route path="/revision/edit"  component={revisionEdit} />
              <Route path="/revision/approverlist"  component={revisionEditApproverList} />
              <Route path="/pending/list"  component={pendingList} />
              <Route path="/pending/print"  component={pendingPrint} />
              <Route path="/pending/view"  component={pendingView} />
              <Route path="/pending/workflow"  component={pendingWorkflow} />
              <Route path="/approved/list"  component={approvedList} />
              <Route path="/approved/print"  component={approvedPrint} />
              <Route path="/approved/view"  component={approvedView} />
              <Route path="/approved/viewggpform"  component={approvedviewGGPForm} />
              <Route path="/approved/workflow"  component={approvedWorkflow} />
              <Route path="/rejected/list"  component={rejectedList} />
              <Route path="/rejected/print"  component={rejectedPrint} />
              <Route path="/rejected/view"  component={rejectedView} />
              <Route path="/rejected/workflow"  component={rejectedWorkflow} />
              <Route path="/cancelled/list"  component={cancelledList} />
              <Route path="/cancelled/print"  component={cancelledPrint} />
              <Route path="/cancelled/view"  component={cancelledView} />
              <Route path="/cancelled/workflow"  component={cancelledWorkflow} />
              <Route path="/pendinggoodsreturn/list"  component={pendinggoodsreturnList} />
              <Route path="/pendinggoodsreturn/print"  component={pendinggoodsreturnPrint} />
              <Route path="/pendinggoodsreturn/view"  component={pendinggoodsreturnView} />
              <Route path="/pendinggoodsreturn/workflow"  component={pendinggoodsreturnWorkflow} />
              <Route path="/pendingconfirmgoodsreturn/list"  component={pendingconfirmgoodsreturnList} />
              <Route path="/pendingconfirmgoodsreturn/print"  component={pendingconfirmgoodsreturnPrint} />
              <Route path="/pendingconfirmgoodsreturn/view"  component={pendingconfirmgoodsreturnView} />
              <Route path="/pendingconfirmgoodsreturn/workflow"  component={pendingconfirmgoodsreturnWorkflow} />
              <Route path="/securitycancelled/list"  component={securitycancelledList} />
              <Route path="/createrequest"  component={CreateRequest} />
              <Route path="/create/approverlist"  component={ApproverList} />
              <Route path="/typeofgoods/typeofgoodsList"  component={TypeofgoodsList} />
              <Route path="/typeofgoods/create"  component={Typeofgoodscreate} />
              <Route path="/typeofgoods/edit"  component={Typeofgoodsedit} />
              <Route path="/mytask/approved/list"  component={MyTaskapprovedList} />
              <Route path="/mytask/approved/print"  component={MyTaskapprovedPrint} />
              <Route path="/mytask/approved/view"  component={MyTaskapprovedView} />
              <Route path="/mytask/approved/workflow"  component={MyTaskapprovedWorkflow} />
              <Route path="/mytask/pending/list"  component={MyTaskpendingList} />
              <Route path="/mytask/pending/print"  component={MyTaskpendingPrint} />
              <Route path="/mytask/pending/view"  component={MyTaskpendingView} />
              <Route path="/mytask/pending/workflow"  component={MyTaskpendingWorkflow} />
              <Route path="/mytask/rejected/list"  component={MyTaskrejectedList} />
              <Route path="/mytask/rejected/print"  component={MyTaskrejectedPrint} />
              <Route path="/mytask/rejected/view"  component={MyTaskrejectedView} />
              <Route path="/mytask/rejected/workflow"  component={MyTaskrejectedWorkflow} />
              <Route path="/mailactions/action"  component={MailActions} />
              <Route path="/mailactions/view"  component={MailActionsviewRequest} />
              <Route path="/exitentry/update"  component={Exitentryupdate} />
              <Route path="/exitentry/view"  component={Exitentryview} />
              <Route path="/exitentry/list"  component={GgpHistory} />
              <Route path="/report/list"  component={GGPReport} />
              <Route path="/print"  component={printRequest} />
              <Route path="/pending/edit" component={pendingEdit} />
              <Route path="/pending/aprroverlist" component={pendingApproverList} />
              <Route path="/ExitEntry/excelview" component={ExcelView}/>
            </Switch>
          </div>
      </BrowserRouter>
    );
  }
};

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

export default connect(mapStateToProps)(Routers);