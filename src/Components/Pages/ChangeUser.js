import React, { Component } from 'react';

class ChangeUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
    <> 
        <div className="vh-100">
            <div className="login-form">    
                <form action="/examples/actions/confirmation.php" method="post">
                    <div className="avatar"><i className="material-icons">&#xE7FF;</i></div>
                    <h4 className="modal-title">Login to Your Account</h4>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Password" />
                    </div>
                </form>			
            </div>
        </div>
    </>
    );
  }
}

export default ChangeUser;