import React from 'react';

const FloatingButton = () => {
  return (
    <>
      <button type="button" id="btn" className="btn btn-create-request" onClick={(e) => {e.preventDefault();   window.location.href=process.env.REACT_APP_ENV +"/createrequest"; }}>
      <i className="fa fa-plus p_5"></i>
        <span className="cr-text">&nbsp;Create Request </span>
      </button>
    </>
  );
};

export default FloatingButton;