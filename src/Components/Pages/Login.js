import React, { Component } from 'react';
import {  Modal,Button } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleReactValidator from 'simple-react-validator';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import { isIE } from 'react-device-detect';

toast.configure();

class Login extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, className: 'text-danger' });
    this.state = {
        username: "",
        password: "",
        passwordFieldType: "password",
        LoginFormButtonName: "Login",
        showpopup:false,
    };
  }
  
  componentDidMount() {
    if(!localStorage.getItem("browserpopu")){      
        if(isIE){          
          this.setState({showpopup:true})
        }
        localStorage.setItem('browserpopu', "yes");
      }
  }

  yespopup =() =>{
      this.setState({showpopup:false})
  }

  isLogin = () =>{
    this.setState({ LoginFormButtonName: <Spinner animation="border" className="dashboard-count-spinner"/> })
    if (this.validator.allValid()) {
        let postUserData = {
            UserName: this.state.username,
            Password: this.state.password,
        };
        console.log(postUserData);
        const url = encodeURI(process.env.REACT_APP_WEB_SERVICE_URL + "/Token");
        const postCustData = "grant_type=password&username="+ this.state.username +"&password="+ this.state.password;
        fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: postCustData
        })
            .then((res) => res.json())
            .then((token) => {
            console.log(token);
            fetch(process.env.REACT_APP_WEB_SERVICE_URL + "/api/Login/Login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token.access_token,
                },
                body: JSON.stringify(postUserData)
            }).then(response=>{
                console.log(response)
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                    this.setState({ LoginFormButtonName: "Login" });
                    this.props.dispatch({ type: 'Token', value: "" });
                    this.props.dispatch({ type: 'userType', value: "" });
                    this.props.dispatch({ type: 'userName', value: "" });
                    this.props.dispatch({ type: 'UserId', value: "" });
                    
                    toast.error(" Incorrect username or password.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });
                }
            })
            .then((profile) => {
                console.log(profile)
                if(profile){
                    this.props.dispatch({ type: 'Token', value: token.access_token });
                    this.props.dispatch({ type: 'userType', value: profile.Profile.UserType });
                    this.props.dispatch({ type: 'userName', value: profile.Profile.Name });
                    this.props.dispatch({ type: 'UserId', value: profile.Profile.Employeeid });
                    if(profile.Profile.Employeeid){
                    this.setState({ LoginFormButtonName: "Login" });                    
                    toast.success("Login successfully.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });
                    }else{
                        this.setState({ LoginFormButtonName: "Login" });  
                        toast.error(" Incorrect username or password.", {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                        });
                    }
                }
            })
        })
            //.catch((error) => this.setState({ cities: [] }));
    } else {
        this.setState({ LoginFormButtonName: "Login" })
        this.validator.showMessages();
        this.forceUpdate();
    }
  }

  validateFields = (e) => {	
	switch (e.target.name) {        
		case "username":
			this.setState({ username: e.target.value })
			break;
		case "password":
			this.setState({ password: e.target.value })
			break;
	  default: break;
    }
}
 
showPassword = () =>{
  this.setState({ passwordFieldType: "text" })
}

hidePassword = () =>{
  this.setState({ passwordFieldType: "password" })
}

_handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        this.isLogin()
    }
  }
  render() {
    return (
    <> 
        <div className="vh-100">
            <div className="login-form">    
                <form>
                    <div className=""><img className="brand-logo" src={process.env.REACT_APP_ENV +"/assets/images/logo/GGP-logo.png"}></img></div>
                    <h4 className="modal-title">Goods Gate Pass</h4>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Username" name="username" value={this.state.username} onChange={this.validateFields} onKeyDown={this._handleKeyDown}/>
                        {
                            this.validator.message('Username', this.state.username, 'required')
                        }
                    </div>
                    <div className="form-group">
                      <div class="input-group" id="show_hide_password">
                        <input type={this.state.passwordFieldType} className="form-control" placeholder="Password" name="password"  value={this.state.password} onChange={this.validateFields} onKeyDown={this._handleKeyDown}/>
                        {(() => {
                            if (this.state.passwordFieldType === "password") {
                                return (
                                    <div className="input-group-prepend" onClick={this.showPassword}>
                                    <div className="input-group-text">
                                        <i class="fa fa-eye-slash" aria-hidden="true"></i>
                                    </div>
                                    </div>
                                )
                            }else{
                                return (
                                    <div className="input-group-prepend" onClick={this.hidePassword}>
                                    <div className="input-group-text">
                                        <i class="fa fa-eye" aria-hidden="true"></i>
                                    </div>
                                    </div>
                                )
                            }
                        })()}
                      </div>
                        {
                            this.validator.message('Password', this.state.password, 'required')
                        }
                    </div>
                    <p className="btn btn-primary btn-block btn-lg" onClick={this.isLogin}> {this.state.LoginFormButtonName} </p>
                </form>			
            </div>
        </div>
        <Modal show={this.state.showpopup}>  
          <Modal.Header >Browser Warning</Modal.Header>  
          <Modal.Body>
          <medium id="" class="form-text alert-text">
            This website works better in "Chrome", "Firefox", "Edge"...
          </medium>
            <hr></hr>
            <div className="text-right">
              <Button className="btn btn-light"  onClick={this.yespopup}> OK </Button>                 
            </div>
          </Modal.Body>  
        </Modal>
    </>
    );
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
  
export default connect(mapStateToProps)(Login);