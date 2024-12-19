import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Must be 8 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async  (values) => {
      const { email, password } = values;
   await createUserWithEmailAndPassword(auth, email, password)
      
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email);
        toast.success("Successfully Signed Up!");
        })
       
        .then(() => navigate("/login"))
        .catch((error) => {
          
          toast.error("SignUp Not Successful");
          console.log(error.message);
        });
    },
  });

 

  return (
    <>
    <div className="signup-container">
      <h2 className="signup-title">Sign-Up Form</h2>
      <form className="signup-form" onSubmit={formik.handleSubmit}>
        <label className="signup-label" htmlFor="email">Email Address</label>
        <input
          id="email"
          className="signup-input"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error-message">{formik.errors.email}</div>
        ) : null}

        <label className="signup-label" htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            id="password"
            className="signup-input"
            type={passwordVisible ? "text" : "password"}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <span
            className="password-toggle"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="error-message">{formik.errors.password}</div>
        ) : null}

        <label className="signup-label" htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-wrapper">
          <input
            id="confirmPassword"
            className="signup-input"
            type={confirmPasswordVisible ? "text" : "password"}
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          <span
            className="password-toggle"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="error-message">{formik.errors.confirmPassword}</div>
        ) : null}

        <button className="signup-button" type="submit">Submit</button>

        <p className="signup-footer">
          Already have an account? <NavLink className="signup-link" to="/login">Log In</NavLink>
        </p>
      </form>
      <ToastContainer />
    </div>
    </>
  );
};

export default Signup;
