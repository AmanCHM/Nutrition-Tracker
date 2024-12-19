import React, { useState } from "react";
import {
  setActivityLevel,
  setRequiredCalorie,
} from "../../Redux/calorieGoalSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Exercise = () => {
  const [activity, setActivity] = useState();
  const dispatch = useDispatch();
  const [calculatedCalorie,setCalculatdCalorie]=useState(null);

  
  const handleSubmit = () => {
    calculateCalories()
    dispatch(setActivityLevel(activity));
    dispatch(setRequiredCalorie(calculatedCalorie));
    
  };

  const height = useSelector((state) => state.calorieGoalReducer.height);

  const weight = useSelector((state)=>state.calorieGoalReducer.currentWeight)
  const age = useSelector((state)=>state.calorieGoalReducer.age)
  const gender = useSelector((state)=>state.calorieGoalReducer.gender)
 const selectActivity = useSelector ((state)=>state.calorieGoalReducer.activity)

 console.log("height",height);
 console.log("age",age);
 console.log(weight);
 console.log(gender);
 console.log(selectActivity);

  const calculateCalories = async () => {
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const totalCalories = Math.round(bmr * selectActivity);

    console.log("totalcalorie", totalCalories);

    setCalculatdCalorie(totalCalories);
  };

  return (
    <>
      <div className="calorie-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="gender">Select Activity</label>
            <select
              id="gender"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="1.2">Sedentary (little to no exercise) </option>
              <option value="1.375">
                Lightly active (light exercise 1–3 days/week)
              </option>
              <option value="1.55">
                Moderately active (moderate exercise 3–5 days/week)
              </option>
              <option value="1.725">
                Very active (hard exercise 6–7 days/week)
              </option>
              <option value="1.9">
                Extra active (very hard exercise or a physical job)
              </option>
            </select>
          </div>
          <button type='submit'>
              <Link
                to={"/calorie-need"}
                style={{ color: "white", fontSize: "17px" }}
              >
               Next
              </Link>{" "}
            </button>
        </form>
      </div>
    </>
  );
};

export default Exercise;
