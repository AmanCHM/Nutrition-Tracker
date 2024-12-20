import React, { useState } from "react";
import { setUserInfo } from "../../Redux/calorieGoalSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const [userName, setUserName] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

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

  return (
    <>
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

        <div className="input-group"     >
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Select Gender --
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="age">Age (years):</label>
          <input
            id="age"
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age in years"
            required
          />
        </div>

        <button type="submit" style={{ color: "white", fontSize: "17px" }}>
          Next
        </button>
      </form>
      </div>
    </>
  );
};

export default UserInfo;
