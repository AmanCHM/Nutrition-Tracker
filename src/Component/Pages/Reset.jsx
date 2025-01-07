import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import Navbar from "../Page-Components/Navbar";
import { toast } from "react-toastify";

const Reset = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email sent");
      navigate("/login");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error("Email not registered");
      console.log(errorCode, errorMessage);
    }
  };

  
  return (
    <>

    <Navbar/>
      <form onSubmit={handleSubmit}  className="login-container">
        <div>
        <h2 className="login-title">Reset Password Form</h2>
        <label className="login-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            className="login-input"
            name="email"
            type="email"
            
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset-Password</button>
        <p className="login-footer" style={{color:"#303952"}}>
   Go to login page <Link to="/login"  className="login-link">Log-in</Link>
  </p>
      </form>
    </>
  );
};

export default Reset;
