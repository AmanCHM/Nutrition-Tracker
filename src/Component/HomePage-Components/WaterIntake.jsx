import React, { useState } from 'react';
import './WaterIntake.css'
import { FaTint } from 'react-icons/fa'; 
function WaterIntake() {
  const [intake, setIntake] = useState(0);

  const addWater = (amount) => {
    setIntake(intake + amount);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Water Intake Tracker</h1>
        <p>Today's Intake: {intake} ml</p>
        <div className="button-container">
          <button onClick={() => addWater(250)}>
            <FaTint /> Add 250 ml
          </button>
          <button onClick={() => addWater(500)}>
            <FaTint /> Add 500 ml
          </button>
        </div>
      </header>
    </div>
  );
}

export default WaterIntake;