import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signup = () => {
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
    onSubmit:  (values) => {
      // e.preventDefault();
      const { email, password } = values;
  createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user.email);
          console.log(user.password);
          toast.success("Successfully Signed-Up!");
        })
        .then(() => navigate("/login"))
        .catch((error) => {
          const errorCode = error.code;

          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    },
  });
  return (
    <>

    <h2>Sign-Up Form</h2>
      <form className="form" onSubmit={formik.handleSubmit}>
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
          Already have account?<NavLink to="/login">log in </NavLink>
        </p>
      </form>
      <ToastContainer></ToastContainer>
    </>
  );
};
export default Signup;
