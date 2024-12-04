import { getAuth } from "firebase/auth";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";

import { loggedout } from "../Redux/counterSlice";
import { db } from "../firebase";


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetData = async () => {
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
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("error fetching data", error);
    }
  };



  const handleLogout = () => {
    dispatch(loggedout())
    navigate("/");
  };

  return (
    <>

<button onClick={handleGetData}>get data</button>

      <button type="submit" onClick={handleLogout}>
        LogOut
      </button>
 
    </>
  );
};

export default Dashboard;
