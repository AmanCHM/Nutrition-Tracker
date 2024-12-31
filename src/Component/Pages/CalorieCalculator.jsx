import React, { useState } from "react";
import Select from "react-select";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import "./CalorieCalculator.css";
import { toast } from 'react-toastify';
import GlobalSelect from "../Page-Components/Globalselect";


const activityOptions = [
  { value: 1.2, label: "Sedentary (little to no exercise)" },
  { value: 1.375, label: "Lightly active (light exercise 1-3 days/week)" },
  { value: 1.55, label: "Moderately active (moderate exercise 3-5 days/week)" },
  { value: 1.725, label: "Very active (hard exercise 6-7 days/week)" },
  { value: 1.9, label: "Extra active (very hard exercise or a physical job)" },
];

const CalorieCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState(activityOptions[0]);
  const [calculatedCalorie, setCalculatedCalorie] = useState(null);
  const currentUser = auth.currentUser;

  const calculateCalorieIntake = () => {
    if (!height || !weight || !age) {
      toast.error('Please fill out all fields.')
      return null;
    }

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
      } catch (error) {
        console.error("Error saving data", error);
      }
    } else {
      toast.error('User not authenticated. Please log in.')
    }
  };

  const handleCalculate = () => {
    const totalCalories = calculateCalorieIntake();
    if (totalCalories) {
      setCalculatedCalorie(totalCalories);
    }
  };

  const handleSave = async () => {
    if (calculatedCalorie) {
      await saveCalorieToDatabase(calculatedCalorie);
     toast.success("Save Successfully")
    } else {
       toast.error("Login not successful");
    }
  };

  return (
    <>
      <Navbar />
      <div className="calorie-container">
        <h1 className="calorie-title"> Calculate your Daily Energy Intake</h1>
        {/* <p className="header-description">
          Plan your daily energy intake and achieve your fitness goals effortlessly. Fill in your details, select your activity level, and discover your personalized energy needs.
        </p> */}
        <div className="input-group">
          <label htmlFor="height">Height (cm):</label>
          <input
            id="height"
            type="number"
            min='25'
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height in cm"
          />
        </div>
        <div className="input-group">
          <label htmlFor="weight">Weight (kg):</label>
          <input
            id="weight"
            type="number"
            min="1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
          />
        </div>
        <div className="input-group">
          <label htmlFor="age">Age (years):</label>
          <input
            id="age"
            min="1"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age in years"
          />
        </div>
        <div className="input-group">
          <label htmlFor="activity">Activity Level:</label>
          <GlobalSelect
            id="activity"
            options={activityOptions}
            value={activityLevel}
            onChange={(selectedOption) => setActivityLevel(selectedOption)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
       
        <button className="calculate-button" onClick={handleCalculate}>
          Calculate
        </button>
        {calculatedCalorie && (
          <>
            <p className="result">
              You require approximately {calculatedCalorie} kcal daily based on your activity level.
            </p>
            <button className="calculate-button " onClick={handleSave}>
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
