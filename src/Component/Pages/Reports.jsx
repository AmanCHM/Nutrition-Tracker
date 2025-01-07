import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Bar,Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend ,CategoryScale, LinearScale, BarElement, Title } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
ChartJS.register(ArcElement, Tooltip, Legend);
import "./Reports.css";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import Table from "../Page-Components/Table";
import Image from "../Image/Image";

const Reports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setLogdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [weeklyData, setWeeklyData] = useState({
    calories: [],
    proteins: [],
    carbs: [],
    fats: [],
  });

  const loader = useSelector((state)=> state.loaderReducer.loading)
 
  // Fetch User Data from Firestore
  const handleGetData = async (user) => {
    try {
      dispatch(showLoader())
      if (!user) {
       
        setLoading(false);
        return;
      }
      const userId = user.uid;
      const date = selectDate;
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      // const sanpdata = onSnapshot(docRef, (docRef) => {
      // });
    
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const mealData = docSnap.data();
        setLogdata(mealData);
      } else {
        setLogdata({});
      }
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      dispatch(hideLoader())
    }
  };



  // const handleGetWeeklyData = async (user) => {
  //   try {
  //     dispatch(showLoader());
  //     if (!user) {
  //       console.log("User is not authenticated");
  //       setLoading(false);
  //       return;
  //     }
  //     const userId = user.uid;
  //     const currentDate = new Date();
  //     const weekData = {
  //       calories: [],
  //       proteins: [],
  //       carbs: [],
  //       fats: [],
  //     };

  //     for (let i = 0; i < 7; i++) {
  //       const date = new Date(currentDate);
  //       date.setDate(currentDate.getDate() - i);
  //       const formattedDate = date.toISOString().split("T")[0];
  //       const docRef = doc(db, "users", userId, "dailyLogs", formattedDate);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         const mealData = docSnap.data();
  //         weekData.calories.push(mealData.calories || 0);
  //         weekData.proteins.push(mealData.proteins || 0);
  //         weekData.carbs.push(mealData.carbs || 0);
  //         weekData.fats.push(mealData.fats || 0);
  //       } else {
  //         weekData.calories.push(0);
  //         weekData.proteins.push(0);
  //         weekData.carbs.push(0);
  //         weekData.fats.push(0);
  //       }
  //     }

  //     setWeeklyData(weekData);
  //   } catch (error) {
  //     console.error("error fetching data", error);
  //   } finally {
  //     dispatch(hideLoader());
  //   }
  // };


  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setLoading(true);
  //       handleGetData(user, selectDate);
  //       handleGetWeeklyData(user);
  //     } else {
  //       console.log("No user authenticated");
  //       setLoading(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [auth, selectDate]);


  // const data = {
  //   labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  //   datasets: [
  //     {
  //       label: 'Calories',
  //       data: weeklyData.calories.reverse(),
  //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //     },
  //     {
  //       label: 'Proteins',
  //       data: weeklyData.proteins.reverse(),
  //       backgroundColor: 'rgba(153, 102, 255, 0.6)',
  //     },
  //     {
  //       label: 'Carbs',
  //       data: weeklyData.carbs.reverse(),
  //       backgroundColor: 'rgba(255, 159, 64, 0.6)',
  //     },
  //     {
  //       label: 'Fats',
  //       data: weeklyData.fats.reverse(),
  //       backgroundColor: 'rgba(255, 99, 132, 0.6)',
  //     },
  //   ],
  // };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Weekly Nutrient Report',
  //     },
  //   },
  // };

      
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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


  // set the  donut chart data 
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


  return (
    <>
      <Navbar />

      <div className="select-date" style={{ backgroundImage: `url(${Image.bgSelectDate})` }}>
        

      <h3 className="selectDate-header" >Select Date</h3>
        <input
          type="Date"
          className="date-input"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
        />
     
        <br />
      </div>

      <Table
      logData={logData}
      showFeature={false}
      />
        
        {/* <div className="reports-data"> */}
          
          <h2  style={{marginRight:"1%",marginTop:'5vh', fontSize:"2rem"}}> Total Calorie Consumed : {totalCalories} kcal</h2>
          <div className="reports-chart">
          <Doughnut 
            data={chartData}
            style={{ marginRight: "20px", marginTop: "30px",   height: "auto",
            width: "50%" }}
          ></Doughnut>
                  <div className="dashboard-text">
            {chartData.labels.map((label, index) => {
              const value = chartData.datasets[0].data[index];
             
              return (
                <div key={index} className="dashboard-text-item">
                  <strong>{label}:</strong> {value} kcal
                </div>
              );
            })}
          </div>
          </div>
        {/* </div> */}
      
        {/* <div>
      <h2>Weekly Report</h2>
      {loading ? <p>Loading...</p> : <Bar data={data} options={options} />}
      <h2>Date-wise Report</h2>
      <input
        type="date"
        value={selectDate}
        onChange={(e) => setSelectDate(e.target.value)}
      />
      <pre>{JSON.stringify(logData, null, 2)}</pre>
    </div> */}
      <Footer />
    </>
  );
};

export default Reports;