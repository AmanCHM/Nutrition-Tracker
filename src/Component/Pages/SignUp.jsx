import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import "react-toastify/dist/ReactToastify.css";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { useDispatch } from "react-redux";
import Navbar from "../Page-Components/Navbar";
import { toast } from "react-toastify";
import { loggedin, setSignup } from "../../Redux/logSlice";
import { doc, setDoc } from "firebase/firestore";
import googleLogo from "../../assets/images/google.png"; 

const Signup = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const provider = new GoogleAuthProvider(); 
  

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
    onSubmit: async (values) => {
      dispatch(showLoader());
      const { email, password } = values;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { calorie: 2000 ,water: 3000 ,alcohol:600,caffeine:850});

        toast.success("SignUp Successful");
        dispatch(loggedin());
        navigate("/dashboard");
      } catch (error) {
        console.log(error.message);
        toast.error("SignUp not successful");
      } finally {
        dispatch(setSignup());
        dispatch(hideLoader());
      }
    },
  });

  const handleGoogleSignup = async () => {
    formik.values.email="";
    formik.values.password="";
    formik.values.confirmPassword="";
    dispatch(showLoader());
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { calorie: 2000 });

      toast.success("Google Sign-Up Successful");
      dispatch(loggedin());
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google Sign-Up Failed");
      console.error("Error with Google Sign-Up: ", error.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      <Navbar />
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

          <button className="signup-button" type="submit">Sign Up</button>
        </form>
        <p className="login-footer">Or</p>
        <button className="signup-button" onClick={handleGoogleSignup}>
          <img src={googleLogo} alt="Google Logo" className="google-logo" />
          Sign Up with Google
        </button>

        <p className="signup-footer">
          Already have an account? <Link className="signup-link" to="/login">Log In</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
