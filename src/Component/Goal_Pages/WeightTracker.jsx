import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import GlobalSelect from "./../Page-Components/Globalselect";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateGoal } from "../../Redux/calorieGoalSlice";

function WeightTracker() {
  const currentWeight = useSelector(
    (state) => state.calorieGoalReducer.currentWeight
  );
  const targetWeightRedux = useSelector(
    (state) => state.calorieGoalReducer.targetWeight
  );
  const goalOption = useSelector((state) => state.calorieGoalReducer.goal);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goalOptions = [
    { value: "Loose Weight", label: "Loose Weight" },
    { value: "Gain Weight", label: "Gain Weight" },
    { value: "Maintain Weight", label: "Maintain Weight" },
  ];

  const formik = useFormik({
    initialValues: {
      goal: goalOption || "",
      currentWeight: currentWeight || "",
      targetWeight: targetWeightRedux || "",
    },
    validationSchema: Yup.object({
      goal: Yup.string().required("Please select a goal."),
      currentWeight: Yup.number()
        .min(1, "Current weight must be at least 1 kg.")
        .required("Please enter your current weight."),
      targetWeight: Yup.number()
        .min(1, "Target weight must be at least 1 kg.")
        .required("Please enter your target weight."),
    }),
    onSubmit: (values) => {
      const weightDifference = values.targetWeight - values.currentWeight;

      if (values.goal === "Loose Weight" && weightDifference > 0) {
        toast.error(
          "Target weight must be less than current weight for weight loss."
        );
        return;
      }
      if (values.goal === "Gain Weight" && weightDifference < 0) {
        toast.error(
          "Target weight must be greater than current weight for weight gain."
        );
        return;
      }
      if (values.goal === "Maintain Weight" && weightDifference !== 0) {
        toast.error("Target weight must equal current weight for maintenance.");
        return;
      }

      dispatch(
        updateGoal({
          goal: values.goal,
          currentWeight: values.currentWeight,
          targetWeight: values.targetWeight,
          weightDifference,
        })
      );

      navigate("/input-workout");
    },
  });

  useEffect(() => {
    if (formik.values.goal === "Maintain Weight") {
      formik.setFieldValue("targetWeight", formik.values.currentWeight);
    }
  }, [formik.values.goal, formik.values.currentWeight]);

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
        Thanks! Now for your goals.
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        Select your goal and provide your target weights.
      </h3>
      <div className="calorie-container">
        <form onSubmit={formik.handleSubmit}>
          {/* Goal Selection */}
          <div className="input-group">
            <label htmlFor="goal">Select Goal:</label>
            <GlobalSelect
              options={goalOptions}
              value={goalOptions.find(
                (option) => option.value === formik.values.goal
              )}
              onChange={(selectedOption) =>
                formik.setFieldValue("goal", selectedOption.value)
              }
              onBlur={() => formik.setFieldTouched("goal", true)}
            />
            {formik.touched.goal && formik.errors.goal && (
              <p className="error-message">{formik.errors.goal}</p>
            )}
          </div>

          {/* Current Weight */}
          <div className="input-group">
            <label htmlFor="currentWeight">Current Weight (kg)</label>
            <input
              type="number"
              id="currentWeight"
              min="1"
              value={formik.values.currentWeight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your current weight"
            />
            {formik.touched.currentWeight && formik.errors.currentWeight && (
              <p className="error-message">{formik.errors.currentWeight}</p>
            )}
          </div>

          {/* Target Weight */}
          <div className="input-group">
            <label htmlFor="targetWeight">Target Weight (kg)</label>
            <input
              type="number"
              id="targetWeight"
              min="1"
              value={formik.values.targetWeight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your target weight"
              disabled={formik.values.goal === "Maintain Weight"}
            />
            {formik.touched.targetWeight && formik.errors.targetWeight && (
              <p className="error-message">{formik.errors.targetWeight}</p>
            )}
          </div>

          {/* Buttons */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button onClick={() =>  navigate('/userinfo')}>Back</button>
            <button type="submit" style={{ color: "white"}}>
              Next
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default WeightTracker;
