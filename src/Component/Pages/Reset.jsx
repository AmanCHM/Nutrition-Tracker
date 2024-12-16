import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Reset = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
     sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("email sent");
    })
    .then(() => {
      alert("email sent");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset-Password</button>
        <p>
   Go to login page <NavLink to="/login">Log-in</NavLink>
  </p>
      </form>
    </>
  );
};

export default Reset;
