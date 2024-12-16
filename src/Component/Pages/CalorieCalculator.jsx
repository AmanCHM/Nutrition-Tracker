import React, { useState } from "react";
import { useSelector } from "react-redux";
import { collection, doc, setDoc } from "firebase/firestore";

import "./CalorieCalculator.css";
import { auth, db } from "../../firebase";
import Navbar from "../Page-Components/Navbar";
import Footer from './../Page-Components/Footer';

const CalorieCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [message, setMessage] = useState(null);

  const currentUser = auth.currentUser; 
  const userId = currentUser?.uid || null; 

  const calculateCalories = async () => {
    if (!height || !weight || !age) {
      alert("Please fill out all fields.");
      return;
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

    const totalCalories = Math.round(bmr * 1.55);
  

    const currentUser = auth.currentUser; 
    const userId = currentUser?.uid; 
    if (userId) {
     
      try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { calorie: totalCalories }, { merge: true });
        setMessage("Calorie data saved");
      } catch (error) {
        console.error("Error saving  data", error);
        setMessage("Failed to save data.");
      }
    } else {
      setMessage("User not authenticated. Please log in.");
    }
  };

  return (
    <>
        <Navbar/>
    <div className="calorie-container">
      <h1 className="calorie-title">Calorie Requirement Calculator</h1>
      <div className="input-group">
        <label htmlFor="height">Height (cm):</label>
        <input
          id="height"
          type="number"
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
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight in kg"
        />
      </div>
      <div className="input-group">
        <label htmlFor="age">Age (years):</label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age in years"
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
      <button className="calculate-button" onClick={calculateCalories}>
        Calculate & Save
      </button>
      {message && <p className="message">{message}</p>}
    </div>

    <Footer/>
    </>
  );
};

export default CalorieCalculator;
