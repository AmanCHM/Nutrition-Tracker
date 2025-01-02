import React from "react";
import { setUserInfo } from "../../Redux/calorieGoalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import GlobalSelect from "./../Page-Components/Globalselect";
import { toast } from "react-toastify";

const UserInfo = () => {
  const userheight = useSelector((state) => state.calorieGoalReducer.height);
  const userage = useSelector((state) => state.calorieGoalReducer.age);
  const usergender = useSelector((state) => state.calorieGoalReducer.gender);
  const username = useSelector((state) => state.calorieGoalReducer.userName);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const formik = useFormik({
    initialValues: {
      userName: username || "",
      height: userheight || "",
      gender: usergender || "",
      age: userage || "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Name is required."),
      height: Yup.number()
        .required("Height is required.")
        .positive("Height must be positive.")
        .integer("Height must be a whole number."),
      gender: Yup.string().required("Gender is required."),
      age: Yup.number()
        .required("Age is required.")
        .positive("Age must be positive.")
        .integer("Age must be a whole number."),
    }),
    onSubmit: (values) => {
      dispatch(setUserInfo(values));
      navigate("/input-weight");
      toast.success("Information saved successfully!");
    },
  });

  return (
    <>
      <Navbar />
      <h3
        style={{
          fontSize: "2.3rem",
          color: "#737373",
          textAlign: "center",
          marginTop: "3%",
        }}
      >
        Welcome to Nutrition Tracker
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        We’re happy you’re here. <br />
        Let’s get to know a little about you.
      </h3>
      <div className="calorie-container">
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>Enter Your Name</label>
            <input
              type="text"
              id="userName"
              {...formik.getFieldProps("userName")}
              placeholder="Enter your Name"
            />
            {formik.touched.userName && formik.errors.userName && (
              <p className="error-message">{formik.errors.userName}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              {...formik.getFieldProps("height")}
              placeholder="Enter your height"
            />
            {formik.touched.height && formik.errors.height && (
              <p className="error-message">{formik.errors.height}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="gender">Gender:</label>
            <GlobalSelect
              options={genderOptions}
              value={genderOptions.find(
                (option) => option.value === formik.values.gender
              )}
              onChange={(selectedOption) =>
                formik.setFieldValue("gender", selectedOption.value)
              }
              placeholder="-- Select Gender --"
            />
            {formik.touched.gender && formik.errors.gender && (
              <p className="error-message">{formik.errors.gender}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="age">Age (years):</label>
            <input
              type="number"
              id="age"
              {...formik.getFieldProps("age")}
              placeholder="Enter age in years"
            />
            {formik.touched.age && formik.errors.age && (
              <p className="error-message">{formik.errors.age}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              color: "white",
              fontSize: "17px",
              marginLeft: "40%",
            }}
          >
            Next
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UserInfo;
