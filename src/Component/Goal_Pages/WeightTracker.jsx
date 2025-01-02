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
  const currentweight = useSelector(
    (state) => state.calorieGoalReducer.currentWeight
  );
  const target = useSelector((state) => state.calorieGoalReducer.targetWeight);
  const goaloption = useSelector((state) => state.calorieGoalReducer.goal);
  const [presentWeight, setPresentWeight] = useState(currentweight);
  const [targetWeight, setTargetWeight] = useState(target);
  const [goal, setGoal] = useState(goaloption);

  const dispatch = useDispatch();
  const navigate = useNavigate();
//  const  reset = useSelector((state)=>state.calorieGoalReducer.resetGoal)
useEffect(()=>{
  if(goal=="Maintain Weight"){
   setTargetWeight(presentWeight)
  }
} ,[presentWeight])





  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   if (!goal) {
  //     toast.error("Please select a goal.");
  //     return;
  //   }
  //   if (!presentWeight || !targetWeight) {
  //     toast.error("Please enter both present and target weights.");
  //     return;
  //   }

  //   let weightdifference = targetWeight - presentWeight;

  //   console.log(weightdifference);
  //   console.log("weightDifference", weightdifference);
  //   if (goal === "Loose Weight" && weightdifference > 0) {
  //     toast.error("Target weight must less than current weight");
  //     return;
  //   } else if (goal === "Gain Weight" && weightdifference < 0) {
  //     toast.error("Target weight must greater than current weight");
  //     return;
  //   } else if (goal === "Maintain Weight" && !weightdifference == 0) {
  //     toast.error("Target weight must equal to current weight");
  //     return;
  //   }
  //   dispatch(
  //     updateGoal({
  //       goal,
  //       currentWeight: presentWeight,
  //       targetWeight,
  //       weightdifference,
        
  //     })
  //   );
 
  //   navigate("/input-workout");
  // };


  const goalOptions = [
    { value: "Loose Weight", label: "Loose Weight" },
    { value: "Gain Weight", label: "Gain Weight" },
    { value: "Maintain Weight", label: "Maintain Weight" },
  ];

  const formik = useFormik({
    initialValues: {
      goal: "",
      currentWeight: "",
      targetWeight: "",
      weightdifference :targetWeight - presentWeight,
    },
    validationSchema: Yup.object({
      goal: Yup.string().required("Please select a goal."),
      presentWeight: Yup.number()
        .min(1, "Current weight must be at least 1 kg.")
        .positive(" Current Weight must be positive.")
        .integer("Current weight must be a whole number.")
        .required("Please enter your current weight."),
      targetWeight: Yup.number()
      .min(1, "Current weight must be at least 1 kg.")
      .positive(" Current Weight must be positive.")
      .integer("Current weight must be a whole number.")
      .required("Please enter your current weight."),
    }),
    onSubmit: (values) => {
      dispatch(updateGoal(values));
      navigate("/input-workout");
      // toast.success("Information saved successfully!");
    },
  });

console.log("current weight", currentweight);
console.log("targeet weight",target);
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
            value={goalOptions.find((option) => option.value === formik.values.goal)}
            onChange={(selectedOption) => formik.setFieldValue("goal", selectedOption.value)}
           
            onBlur={() => formik.setFieldTouched("goal", true)}
          />
            {formik.touched.goal && formik.errors.goal && (
              <p className="error-message">{formik.errors.goal}</p>
            )}
        </div>

        {/* Current Weight */}
        <div className="input-group">
          <label htmlFor="presentWeight">Current Weight (kg)</label>
          <input
            type="number"
            id="presentWeight"
            min="1"
            value={formik.values.presentWeight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your current weight"
          />
          {formik.touched.presentWeight && formik.errors.presentWeight && (
             <p className="error-message">{formik.errors.presentWeight}</p>
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
          />
          {formik.touched.targetWeight && formik.errors.targetWeight && (
                <p className="error-message">{formik.errors.targetWeight}</p>
          )}
        </div>

        <div style={{ marginTop: "20px", marginLeft: "5%" }}>
            <button className="submit">
              <Link
                to={"/userinfo"}
                style={{ color: "white", fontSize: "17px" }}
              >
                Back
              </Link>{" "}
            </button>
            <button
              type="submit"
              style={{ color: "white", fontSize: "17px", marginLeft: "60%" }}
            >
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


{/* <div className="calorie-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="goal">Select Goal:</label>
            <GlobalSelect
              options={goalOptions}
              value={goalOptions.find((option) => option.value === goal)}
              onChange={(selectedOption) => setGoal(selectedOption.value)}
              // placeholder="-- Select a Goal --"
            />
          </div>

          <div className="input-group">
            <label htmlFor="CurrentWeight">Current Weight (kg)</label>
            <input
              type="number"
              id="CurrentWeight"
              min="1"
              value={presentWeight}
              onChange={(e) => setPresentWeight(e.target.value)}
              placeholder="Enter your current weight"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="targetWeight">Target Weight (kg)</label>
            <input
              type="number"
              id="targetWeight"
              min="1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="Enter your target weight"
              required
            />
          </div>
          <div style={{ marginTop: "20px", marginLeft: "5%" }}>
            <button className="submit">
              <Link
                to={"/userinfo"}
                style={{ color: "white", fontSize: "17px" }}
              >
                Back
              </Link>{" "}
            </button>
            <button
              type="submit"
              style={{ color: "white", fontSize: "17px", marginLeft: "60%" }}
            >
              Next
            </button>
          </div>
        </form>
      </div> */}