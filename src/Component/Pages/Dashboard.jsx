import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { auth, db } from "../../firebase";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
ChartJS.register(ArcElement, Tooltip, Legend);
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setlLogdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
        handleGetData(user);
      } else {
        console.log("No user authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
    labels: ["BreakFast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          "#8AD1C2",
          "#9F8AD1",
          "#D18A99",
          "#BCD18A",
          "#D1C28A",
        ],
        borderWidth: 1,
      },
    ],
  };

  console.log(selectDate);

  return (
    <>
      <Navbar />

    
      <div className="select-date">
        <input
          type="Date"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
        />
        <p>TotalCalories:{totalCalories}</p>
        <br />
      </div>

      <section className="view-data">

        <div className="list-items">
          <h3>Breakfast</h3>

          <ul>
            {logData?.Breakfast?.length > 0 ? (
              logData.Breakfast.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.calories} kcal{" "}
                  <button onClick={() => handleDeleteLog(item.id)}>
                    {" "}
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No breakfast items</li>
            )}
          </ul>

          <h3>Lunch</h3>
          <ul>
            {logData?.Lunch?.length > 0 ? (
              logData.Lunch.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.calories} kcal{" "}
                  <button onClick={() => handleDeleteLog(item.id)}>
                    {" "}
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No lunch items</li>
            )}
          </ul>

          <h3>Snacks</h3>
          <ul>
            {logData?.Snack?.length > 0 ? (
              logData.Snack.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.calories} kcal{" "}
                  <button onClick={() => handleDeleteLog(item.id)}>
                    {" "}
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No snacks item</li>
            )}
          </ul>

          <h3>Dinner</h3>
          <ul>
            {logData?.Dinner?.length > 0 ? (
              logData.Dinner.map((item, index) => (
                <li key={item.id}>
                  {item.name} - {item.calories} kcal{" "}
                  <button onClick={() => handleDeleteLog(item.id)}>
                    {" "}
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No dinner item</li>
            )}
          </ul>
        </div>
        <div className="pie-chart">
          <Pie
            data={chartData}
            style={{ marginRight: "20px", marginTop: "50px" }}
          ></Pie>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Dashboard;
