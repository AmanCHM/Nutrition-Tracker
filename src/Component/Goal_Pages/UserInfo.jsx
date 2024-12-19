import React, { useState } from 'react'
import { setUserInfo } from '../../Redux/calorieGoalSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const UserInfo = () => {


    const [userName ,setUserName] =useState();
    const [height,setHeight]=useState();
    const [gender ,setGender] =useState();
    const [age ,setAge] =useState();
    const dispatch = useDispatch()
    const handleSubmit = (event)=>{
        event.preventDefault();
      dispatch(setUserInfo({ userName: userName, height:height, gender: gender,age:age }));

    }
  return (
    <>
     <form onSubmit={handleSubmit} >
        <div >
          <label >Enter Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) =>  setUserName(e.target.value)}
            placeholder="Enter your Name"
            required
           
          />
        </div>

        <div >
          <label htmlFor="targetWeight"> Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) =>  setHeight(e.target.value)}
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
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
     
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


         <button type='submit'>
              
              <Link
                to={"/input-weight"}
                style={{ color: "white", fontSize: "17px" }}
              >
               Next
              </Link>{" "}
            </button>
      </form>

    
    </>
  )
}

export default UserInfo