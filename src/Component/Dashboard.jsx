import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'



const Dashboard = () => {

    const  {lunch ,breakfast,dinner,snack,totalCalories} =useSelector((state)=>state.meals)
  return (
    <>
      

      <h3>{totalCalories}</h3>
  <h4>Lunch={lunch[0]}</h4>

    
    
    </>
  )
}

export default Dashboard
