import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateGoal } from '../../Redux/calorieGoalSlice';
import { Link } from 'react-router-dom';

function WeightTracker() {
  
  const [presentWeight, setPresentWeight] = useState();
  const [targetWeight, setTargetWeight] = useState();
  const [goal,setGoal] = useState();
  

  const dispatch = useDispatch();


  const handleSubmit = (event) => {
    event.preventDefault();
      dispatch(updateGoal({ goal: goal ,currentWeight: presentWeight, targetWeight: targetWeight }));
  };

  return (
    <div   className="calorie-container">
      <h1> User Details </h1>

        

      <form onSubmit={handleSubmit}>

        <div className="input-group">
        <label htmlFor="goal">Select Goal:</label>
        <select
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="">Loose Weight</option>
          <option value="">Gain weight</option>
          <option value="">Maintain Weight</option>
        </select>
      </div>

        <div >
          <label htmlFor="presentWeight">Present Weight (kg)</label>
          <input
            type=""
            id="presentWeight"
            value={presentWeight}
            onChange={(e) => setPresentWeight(e.target.value)}
            placeholder="Enter your current weight"
            required
         
          />
        </div>

        <div >
          <label htmlFor="targetWeight">Target Weight (kg)</label>
          <input
            type="number"
            id="targetWeight"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="Enter your target weight"
            required
      
          />
        </div>



         <button type='submit'>
              
              <Link
                to={"/input-workout"}
                style={{ color: "white", fontSize: "17px" }}
              >
               Next
              </Link>{" "}
            </button>
      </form>


    </div>
  );
}


export default WeightTracker;