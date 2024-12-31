import React, { useState } from "react";
import { setUserInfo } from "../../Redux/calorieGoalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";

import GlobalSelect from "./../Page-Components/Globalselect";

const UserInfo = () => {
  const userheight = useSelector((state) => state.calorieGoalReducer.height);
  const userage = useSelector((state) => state.calorieGoalReducer.age);
 const usergender = useSelector((state) => state.calorieGoalReducer.gender);
 const username = useSelector((state) => state.calorieGoalReducer. userName);

  const [userName, setUserName] = useState(username);
  const [height, setHeight] = useState(userheight);
  const [gender, setGender] = useState(usergender);
  const [age, setAge] = useState(userage);

  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userName || !height || !gender || !age) {
      alert("Please fill out all fields.");
      return;
    }
    dispatch(setUserInfo({ userName, height, gender, age }));
    navigate("/input-weight");
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
console.log(userName)
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
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Enter Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your Name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              min="25"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="gender">Gender:</label>
            <GlobalSelect
              options={genderOptions}
              value={genderOptions.find((option) => option.value === gender)}
              onChange={(selectedOption) => setGender(selectedOption.value)}
              placeholder="-- Select Gender --"
            />
          </div>

          <div className="input-group">
            <label htmlFor="age">Age (years):</label>
            <input
              id="age"
              type="number"
              min="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age in years"
              required
            />
          </div>


          <button
            type="submit"
            style={{
              color: "white",
              fontSize: "17px",
              marginLeft:"40%"
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
