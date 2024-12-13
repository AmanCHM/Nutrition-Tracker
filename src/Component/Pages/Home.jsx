import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Select from "react-select";
import Modal from "react-modal";
import "./Home.css";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState({ common: [], branded: [] });
  const [selectItem, setSelectItem] = useState({});
  const [modal, setModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectquantity, setSelectquantity] = useState(1);
  const [SelectedFoodData, setSelectedFoodData] = useState({ foods: [] });
  const [selectCategory, setSelectCategory] = useState("");
  const [logData, setLogdata] = useState();
  const [loading, setloading] = useState(false);

  // API Data on serch bar

  const debouncedFetchSuggestions = debounce(async (query) => {
    try {
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant/?query=${query}`,
        {
          headers: {
            "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
            "x-app-key": import.meta.env.VITE_NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 300);

  //post method for nutrients

  const foodData = async (select) => {
    try {
      const response = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          query: `${select}`,
        },
        {
          headers: {
            "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
            "x-app-key": import.meta.env.VITE_NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedFoodData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);

    if (newInputValue) {
      debouncedFetchSuggestions(newInputValue);
    }
    // else {
    //   setSuggestions({ common: [], branded: [] });
    // }
  };

  const groupedOptions = [
    {
      label: "Common Foods",
      options: suggestions.common.map((element) => ({
        value: element.tag_id,
        label: `${element.food_name}`,
        category: "common",
      })),
    },
    {
      label: "Branded Foods",
      options: suggestions.branded.map((element) => ({
        value: element.nix_item_id,
        label: `${element.brand_name_item_name} - ${element.nf_calories} kcal`,
        category: "Branded",
      })),
    },
  ];

  const handleSelectChange = async (selectedOption) => {
    setSelectItem(selectedOption);
    await foodData(selectedOption.label);
    setModal(true);
  };

  // Add Meal data

  const handleModalData = async () => {
    try {
      console.log("inside modal");
      const user = auth.currentUser;
      const data = {
        id: Date.now(),
        name: selectItem.label,
        calories: Math.round(calculateCalories),
      };
      if (user) {
        const userId = user.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", userId, "dailyLogs", date);
        const categorisedData = { [selectCategory]: arrayUnion(data) };

        await setDoc(docRef, categorisedData, { merge: true });
        await handleGetData(user);
        console.log("Data saved successfully!");
      } else {
        console.log("User not authenticated.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
    setModal(false);
  };

  // Get meal data

  // console.log("auth", auth);

  const handleGetData = async (user) => {
    try {
      // console.log("user", user)

      if (!user) {
        console.log("User is not authenticated");
        setloading(false);
        return;
      }
      const userId = user.uid;

      const date = new Date().toISOString().split("T")[0];

      const docRef = doc(db, "users", userId, "dailyLogs", date);

      // const sanpdata =  onSnapshot(docRef, (docRef) => {
      //   console.log(docRef.data());
      // });
      //    const unsub = onSnapshot(docRef, (doc) => {
      //     console.log("Current data: ", doc.data());
      // });
      // console.log("snapdata", sanpdata);
      const docSnap = await getDoc(docRef);
      // console.log("snapdata", docSnap);

      if (docSnap.exists()) {
        const mealData = docSnap.data();
        // console.log("mealdata", mealData);
        setLogdata(mealData);
      } else {
        setLogdata({});
      }

    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    console.log("inside useeffect get data");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleGetData(user);
      if (user) {
        setloading(true);
      } else {
        console.log("No user authenticated");
        setloading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(()=>{


  //   handleGetData(user)

  // })

  const calculateCalories =
    SelectedFoodData.foods.length > 0
      ? (SelectedFoodData.foods[0].nf_calories /
          SelectedFoodData.foods[0].serving_weight_grams) *
        selectquantity *
        quantity
      : "no data";

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

  //pie chart
  const chartData = {
    labels: ["BreakFast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          // 'rgb(255, 205, 86)',
          "#BCD18A",
          "#D1C28A",
        ],
        borderWidth: 1,
      },
    ],
  };

  //doughnut

  const doughnutdata = {
    // labels: [
    //   'Red',
    //   'Blue',
    //   'Yellow'
    // ],
    datasets: [
      {
        label: "Total Calories",
        data: [totalCalories],
        backgroundColor: ["rgb(255, 99, 132)"],
        hoverOffset: 1,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: doughnutdata,
  };

  const handleDeleteLog = async (id) => {
    console.log("inside delete");
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      await deleteDoc(docRef, id);
      console.log(" data deleted");
    } catch (error) {
      console.log(error);
    }
  };

  //  console.log("breakfast",breakfastCalorie);
  //   console.log("total calories", totalCalories);

  // console.log("logdata", logData);
  return (
    <>
      <Navbar />
      <div className="search">
        <h1 id="header-text">Select a food item</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelectChange}
          onInputChange={handleInputChange}
          placeholder="Search here ..."
        />
      </div>
      <Modal
        className="modal"
        isOpen={modal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            background: "#d8e5f7",
            padding: "20px",
            width: "400px",
            marginLeft: "auto",
            borderRadius: "10px",
          },
        }}
      >
        <h2>Your Meal</h2>
        <button
          onClick={() => setModal(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            backgroundColor: "blue",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          x
        </button>

        <b>{selectItem.label}</b>

        <input
          type="text"
          placeholder="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          step="1"
        />

        <br />

        <select
          onChange={(e) => {
            const selectedMeasure = e.target.value;

            setSelectquantity(selectedMeasure);
          }}
        >
          {SelectedFoodData.foods.map((food, foodIndex) =>
            food.alt_measures.map((measure, index) => (
              <option
                key={`${foodIndex}-${index}`}
                value={measure.serving_weight}
              >
                {` ${measure.measure} `}
              </option>
            ))
          )}
        </select>

        <p>Calorie:{Math.round(calculateCalories)}</p>

        <br />
        <select
          name="meal-category"
          id="meal-category"
          onChange={(e) => {
            const selectmealcategory = e.target.value;
            setSelectCategory(selectmealcategory);
          }}
        >
          {" "}
          <option value="" selected disabled hidden>
            Choose here
          </option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snack">Snack</option>
          <option value="Dinner">Dinner</option>
        </select>
        <button onClick={handleModalData}> Add Meal</button>
      </Modal>
     

      <section className="view-data"> 
      <div className="meal-log">
  <table className="meal-table">
    <thead>
      <tr>
        <th>Meal</th>
        <th>Food Name</th>
        <th>Calories (kcal)</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {/* Breakfast */}
      {logData?.Breakfast?.length > 0 ? (
        logData.Breakfast.map((item, index) => (
          <tr key={`breakfast-${index}`}>
            <td>Breakfast</td>
            <td>{item.name}</td>
            <td>{item.calories}</td>
            <td>
              <button onClick={() => handleDeleteLog("Breakfast", item.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>Breakfast</td>
          <td colSpan="3">No breakfast items</td>
        </tr>
      )}

      {/* Lunch */}
      {logData?.Lunch?.length > 0 ? (
        logData.Lunch.map((item, index) => (
          <tr key={`lunch-${index}`}>
            <td>Lunch</td>
            <td>{item.name}</td>
            <td>{item.calories}</td>
            <td>
              <button onClick={() => handleDeleteLog("Lunch", item.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>Lunch</td>
          <td colSpan="3">No lunch items</td>
        </tr>
      )}

      {/* Snacks */}
      {logData?.Snack?.length > 0 ? (
        logData.Snack.map((item, index) => (
          <tr key={`snack-${index}`}>
            <td>Snack</td>
            <td>{item.name}</td>
            <td>{item.calories}</td>
            <td>
              <button onClick={() => handleDeleteLog("Snack", item.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>Snack</td>
          <td colSpan="3">No snack items</td>
        </tr>
      )}

      {/* Dinner */}
      {logData?.Dinner?.length > 0 ? (
        logData.Dinner.map((item, index) => (
          <tr key={`dinner-${index}`}>
            <td>Dinner</td>
            <td>{item.name}</td>
            <td>{item.calories}</td>
            <td>
              <button onClick={() => handleDeleteLog("Dinner", item.id)}>
                Delete
              </button>
            </td>
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

          <h2> Total Calorie Consumption :{totalCalories}</h2>
         <div className="doughnut-data">

          <Doughnut data={doughnutdata} /> 
      </div>


      </section>
      <div className="pie-data">
        <h2>Meals Details</h2>
        <Pie
          data={chartData}
          style={{ marginRight: "20px", marginTop: "50px" }}
        ></Pie>
      </div>
      <Footer className="footer" />
    </>
  );
};

export default Home;
