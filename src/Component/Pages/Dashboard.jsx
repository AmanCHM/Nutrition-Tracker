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
import Table from "../Page-Components/Table";
import Image from "../Image/Image";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setLogdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(
    new Date().toISOString().split("T")[0]
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
          
          <h2 style={{marginRight:"1%",marginTop:'5vh'}}> Today Calorie Consumed :{totalCalories} kcal</h2>
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
      
      <Footer />
    </>
  );
};

export default Dashboard;