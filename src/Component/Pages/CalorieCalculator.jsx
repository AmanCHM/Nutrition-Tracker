import React, { useState } from "react";
import Select from "react-select";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./CalorieCalculator.css";
import { toast } from "react-toastify";
import GlobalSelect from "../Page-Components/Globalselect";

const activityOptions = [
  { value: 1.2, label: "Sedentary (little to no exercise)" },
  { value: 1.375, label: "Lightly active (light exercise 1-3 days/week)" },
  { value: 1.55, label: "Moderately active (moderate exercise 3-5 days/week)" },
  { value: 1.725, label: "Very active (hard exercise 6-7 days/week)" },
  { value: 1.9, label: "Extra active (very hard exercise or a physical job)" },
];

const CalorieCalculator = () => {
  const [calculatedCalorie, setCalculatedCalorie] = useState(null);
  const currentUser = auth.currentUser;

  const formik = useFormik({
    initialValues: {
      height: "",
      weight: "",
      age: "",
      gender: "male",
      activityLevel: activityOptions[0],
    },
    validationSchema: Yup.object({
      height: Yup.number()
        .required("Height is required")
        .positive("Height must be positive")
        .integer("Height must be a whole number"),
      weight: Yup.number()
        .required("Weight is required")
        .positive("Weight must be positive")
        .integer("Weight must be a whole number"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be positive")
        .integer("Age must be a whole number"),
    }),
    onSubmit: (values) => {
      const totalCalories = calculateCalorieIntake(values);
      if (totalCalories) {
        setCalculatedCalorie(totalCalories);
      }
    },
  });

  const calculateCalorieIntake = ({ height, weight, age, gender, activityLevel }) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    return Math.round(bmr * activityLevel.value);
  };

  const saveCalorieToDatabase = async (totalCalories) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, { calorie: totalCalories }, { merge: true });
        toast.success("Calorie data saved successfully.");
      } catch (error) {
        console.error("Error saving data", error);
        toast.error("Failed to save calorie data.");
      }
    } else {
      toast.error("User not authenticated. Please log in.");
    }
  };

  const handleSave = async () => {
    if (calculatedCalorie) {
      await saveCalorieToDatabase(calculatedCalorie);
    } else {
      toast.error("No calorie data to save. Please calculate first.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="calorie-container">
        <h1 className="calorie-title">Calculate Your Daily Energy Intake</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label htmlFor="height">Height (cm):</label>
            <input
              id="height"
              type="text"
              {...formik.getFieldProps("height")}
              placeholder="Enter height in cm"
            />
            {formik.touched.height && formik.errors.height && (
              <p className="error-message">{formik.errors.height}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="weight">Weight (kg):</label>
            <input
              id="weight"
              type="text"
              {...formik.getFieldProps("weight")}
              placeholder="Enter weight in kg"
            />
            {formik.touched.weight && formik.errors.weight && (
              <p className="error-message">{formik.errors.weight}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="age">Age (years):</label>
            <input
              id="age"
              type="text"
              {...formik.getFieldProps("age")}
              placeholder="Enter age in years"
            />
            {formik.touched.age && formik.errors.age && (
              <p className="error-message">{formik.errors.age}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="activity">Activity Level:</label>
            <GlobalSelect
              id="activity"
              options={activityOptions}
              value={formik.values.activityLevel}
              onChange={(selectedOption) =>
                formik.setFieldValue("activityLevel", selectedOption)
              }
            />
          </div>
          <div className="input-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              {...formik.getFieldProps("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button type="submit" className="calculate-button">
            Calculate
          </button>
        </form>
        {calculatedCalorie && (
          <>
            <p className="result">
              You require approximately {calculatedCalorie} kcal daily based on
              your activity level.
            </p>
            <button className="calculate-button" onClick={handleSave}>
              Set Your Daily Meal
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CalorieCalculator;
