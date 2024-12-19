import { useSelector } from "react-redux";

import React, { useState } from "react";


const ShowCalorie= () => {
   
     const requiredCalorie = useSelector((state)=> state.calorieGoalReducer.requiredCalorie)

    console.log( "required",requiredCalorie);
    return (
      <>

         <h2>  Required Calorie :{ requiredCalorie }</h2>
  
         
      </>
    );
  };
  
  export default ShowCalorie;
  