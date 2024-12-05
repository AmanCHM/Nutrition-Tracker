import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { loggedout } from "../Redux/counterSlice";
import { auth, db } from "../firebase";

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from "./Page-Components/Navbar";
ChartJS.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setlLogdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date().toISOString().split("T")[0])
  // Fetch User Data from Firestore
  const handleGetData = async (user) => {
    try {
      // console.log("user", user)

      if (!user) {
        console.log("User is not authenticated");
        setLoading(false);
        return;
      }
      const userId = user.uid;

      const date = selectDate;

      const docRef = doc(db, "users", userId, "dailyLogs", date);

      const sanpdata = onSnapshot(docRef, (docRef) => {
        console.log(docRef.data());
      });
      //    const unsub = onSnapshot(docRef, (doc) => 
      //     console.log("Current data: ", doc.data());
      // });
      console.log("snapdata", sanpdata);
      const docSnap = await getDoc(docRef);
      console.log("snapdata", docSnap);

      if (docSnap.exists()) {
        const mealData = docSnap.data();
        console.log("mealdata", mealData);
        setlLogdata(mealData);
      } else {
        setlLogdata({});
      }
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("User authenticated:", user);
        setLoading(true);
        handleGetData(user); // Pass the user object to fetch data
      } else {
        console.log("No user authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);



   //Calculate calorie
  const breakfastCalorie =
    logData?.Breakfast?.length > 0
      ? logData.Breakfast.reduce((acc, item) => acc + item.calories, 0)
      : 0;

  const lunchCalorie =
    logData?.Lunch?.length > 0
      ? logData.Lunch.reduce((total, item) => total + item.calories, 0)
      : 0;
  const snackCalorie =
    logData?.Snack?.length > 0
      ? logData.Snack.reduce((total, item) => total + item.calories, 0)
      : 0;

  const dinnerCalorie =
    logData?.Dinner?.length > 0
      ? logData.Dinner.reduce((total, item) => total + item.calories, 0)
      : 0;
  const totalCalories =
    breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;


    const chartData = {
      labels: ["BreakFast", "Lunch","Snack","Dinner"],
      datasets: [
        {
          data: [breakfastCalorie, lunchCalorie,snackCalorie,dinnerCalorie],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(115, 212, 132, 0.2)',
            'rgba(175, 150, 163, 0.2)',
          ],
          borderWidth: 1,
        },
      ],
    };

  // Handle Logout
  const handleLogout = () => {
    dispatch(loggedout());
    navigate("/");
  };
 console.log(selectDate);
  // Render UI
  return (
    <>
<div  style={{width:"80vh"}}> <Navbar/></div>
    
    <label htmlFor="">WelCome {}</label>
      <button type="submit" onClick={handleLogout}>
        LogOut
      </button>

      <input type="Date"
      value={selectDate}
      onChange={(e)=> setSelectDate(e.target.value)}
      />
    <p>TotalCalories:{totalCalories}</p>
      <br />
        <Pie data={chartData}></Pie>
      <label htmlFor="">Breakfast</label>
      
    </>
  );
};

export default Dashboard;
