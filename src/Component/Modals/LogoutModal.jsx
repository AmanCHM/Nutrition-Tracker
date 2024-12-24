import React from "react";
import './LogoutModal.css'
const LogoutModal = ({ onClose, onConfirm }) => {


  return (
    <div >
      <div className="modal-content">
        <h2>Are you sure you want to logout?</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Yes, Logout
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
