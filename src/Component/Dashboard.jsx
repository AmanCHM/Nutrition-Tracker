import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { loggedout } from "../Redux/counterSlice";
import { db } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Fetch User Data from Firestore
  const handleGetData = async () => {
    setLoading(true); // Start loading
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.log("User is not authenticated");
        return;
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mealData = docSnap.data();
        setUserData(mealData); // Set fetched data
      } else {
        console.log("No such document!");
        setUserData({}); // Fallback to empty object
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    handleGetData();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    dispatch(loggedout());
    navigate("/");
  };

  // Render UI
  return (
    <>
      <button type="submit" onClick={handleLogout}>
        LogOut
      </button>
      <br />
      <label htmlFor="">Breakfast</label>
      <ul>
        {loading ? ( // Show loading indicator
          <p>Loading...</p>
        ) : userData?.Breakfast?.length > 0 ? ( // Check for breakfast items
          userData.Breakfast.map((item, index) => (
            <li key={index}>
              {item.name} - {item.calories} kcal
            </li>
          ))
        ) : (
          <li>No breakfast items</li> // No data fallback
        )}
      </ul>
    </>
  );
};

export default Dashboard;
