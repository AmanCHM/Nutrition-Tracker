import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { auth, db } from "../../firebase";

import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
ChartJS.register(ArcElement, Tooltip, Legend);
import "./Dashboard.css";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setlLogdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(
   null
  );


  const loader = useSelector((state)=> state.loaderReducer.loading)
  console.log("laoder",loader);
 
  

  // Fetch User Data from Firestore
  const handleGetData = async (user) => {

    try {
      // console.log("user", user)
    dispatch(showLoader())
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
      dispatch(hideLoader())
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("User authenticated:", user);
        setLoading(true);
        handleGetData(user);
      } else {
        console.log("No user authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [selectDate]);

  //Calculate calorie
  const calculateMealCalories = (mealData) => {
    return mealData?.length > 0
      ? mealData.reduce((total, item) => total + item.calories, 0)
      : 0;
  };
  
  const breakfastCalorie = calculateMealCalories(logData?.Breakfast);
  const lunchCalorie = calculateMealCalories(logData?.Lunch);
  const snackCalorie = calculateMealCalories(logData?.Snack);
  const dinnerCalorie = calculateMealCalories(logData?.Dinner);

  const totalCalories = breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;

  const chartData = {
    labels: ["BreakFast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          "rgb(255, 99, 132)",
         
          "rgb(54, 162, 235)",
          "#afc0d9",
          "#D1C28A",
        ],
        hoverOffset: 1,
      },
    ],
  };

  console.log(selectDate);

  return (
    <>
      <Navbar />

      <div className="select-date">
        

      <h3 id="header-text" style={{fontSize:"2.5rem" }}>Select Date</h3>
        <input
          type="Date"
          className="date-input"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
        />
     
        <br />
      </div>

      <section className="view-data">
        <div className="meal-log">
          <h2>Your Food Diary for {selectDate}</h2>
          <table className="meal-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Food Name</th>
                <th>Calories (kcal)</th>
               
              </tr>
            </thead>
            <tbody>
              {logData?.Breakfast?.length > 0 ? (
                logData.Breakfast.map((item, index) => (
                  <tr key={`breakfast-${index}`}>
                    <td>Breakfast</td>
                    <td>{item.name}</td>
                    <td>{item.calories}</td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Breakfast</td>
                  <td colSpan="3">No breakfast items</td>
                </tr>
              )}

              {logData?.Lunch?.length > 0 ? (
                logData.Lunch.map((item, index) => (
                  <tr key={`lunch-${index}`}>
                    <td>Lunch</td>
                    <td>{item.name}</td>
                    <td>{item.calories}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Lunch</td>
                  <td colSpan="3">No lunch items</td>
                </tr>
              )}

              {logData?.Snack?.length > 0 ? (
                logData.Snack.map((item, index) => (
                  <tr key={`snack-${index}`}>
                    <td>Snack</td>
                    <td>{item.name}</td>
                    <td>{item.calories}</td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Snack</td>
                  <td colSpan="3">No snack items</td>
                </tr>
              )}

              {logData?.Dinner?.length > 0 ? (
                logData.Dinner.map((item, index) => (
                  <tr key={`dinner-${index}`}>
                    <td>Dinner</td>
                    <td>{item.name}</td>
                    <td>{item.calories}</td>
                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Dinner</td>
                  <td colSpan="3">No dinner items</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="total-calorie">
          <h2 style={{marginRight:"1%"}}> Today Calorie Consumed :{totalCalories} kcal</h2>
          <div className="piechart-data">
          <Doughnut
            data={chartData}
            style={{ marginRight: "20px", marginTop: "50px" }}
          ></Doughnut>
          </div>
        </div>
      </section>
      
      
      <Footer />
    </>
  );
};

export default Dashboard;