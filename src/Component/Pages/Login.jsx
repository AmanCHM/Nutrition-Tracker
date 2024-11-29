import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Signup.css";

const Login = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "must be 8 character").required("Required"),
    }),
    onSubmit: (values) => {
      const { email, password } = values;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("Successfully loggedIn!");
          console.log(user);
          localStorage.setItem("isAuthenticated", true);
        })
        .then(() => {
          navigate("/home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    },
  });

  return (
    <>
    <h2>Log-in Form</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {formik.errors.email}
          </div>
        ) : null}

        <label htmlFor="Password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {formik.errors.password}
          </div>
        ) : null}

        <button type="submit">Submit</button>

        <p>
          Forget password ? <NavLink to="/reset">Reset-Password</NavLink>
        </p>
        <p>
          Don't have account? <NavLink to="/signup">Sign Up</NavLink>
        </p>
      </form>
      <ToastContainer />
    </>
  );
};

export default Login;
