import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce, get } from "lodash";
import Select from "react-select";
import Modal from "react-modal";
import "./Home.css";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import NutritionModal from "./NutritionModal";
import {
  useAddMealMutation,
  useFetchSuggestionsQuery,
} from "../../Redux/foodApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import MealModal from "../Modals/MealModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [inputValue, setInputValue] = useState();
  const [selectItem, setSelectItem] = useState();
  const [modal, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectquantity, setSelectquantity] = useState(1);
  const [selectCategory, setSelectCategory] = useState("");
  const [logData, setLogdata] = useState();
  const [isloading, setloading] = useState(false);
  const [dailycalorie, setDailyCalorie] = useState(null);



  const loader = useSelector((state)=> state.loaderReducer.loading)
  console.log("laoder",loader);
 
  const dispatch = useDispatch()
 

  //food suggestion search bar
  const {
    data: suggestions,
    isLoading,
    isError,
  } = useFetchSuggestionsQuery(inputValue);

  const groupedOptions = [
    {
      label: "Common Foods",
      options: suggestions?.common.map((element) => ({
        value: element.tag_id,
        label: `${element.food_name}`,
        category: "common",
      })),
    },
    {
      label: "Branded Foods",
      options: suggestions?.branded.map((element) => ({
        value: element.nix_item_id,
        label: `${element.brand_name_item_name} - ${element.nf_calories} kcal`,
        category: "Branded",
      })),
    },
  ];


    //add food 
    const [addMeal, { data: selectedFoodData }] = useAddMealMutation();

    const handleSearch = (query) => {
      setInputValue(query);
    };


  const handleSelect = (selectedOption) => {
    setSelectItem(selectedOption)
    if (selectedOption) {
      addMeal(selectedOption?.label);
    }
    setModal(true);
  };


  // Add Meal data

  const handleModalData = async () => {
    try {
     dispatch(showLoader())
      // console.log("inside modal");
      const user = auth.currentUser;
      const data = {
        id: Date.now(),
        name: selectItem.label,
        calories: Math.round(calculateCalories),
        proteins: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      };
      if (user) {
        const userId = user?.uid;
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
    } finally {
      setModal(false);
      dispatch(hideLoader())
    }
  };

//get user mealdata
  const handleGetData = async (user) => {
    try {
      // console.log("user", user)
      dispatch(showLoader())
      if (!user) {
        console.log("User is not authenticated");

        return;
      }
      const userId = user.uid;

      const date = new Date().toISOString().split("T")[0];

      const docRef = doc(db, "users", userId, "dailyLogs", date);

      const docSnap = await getDoc(docRef);
      console.log("getdata", docSnap.data());
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
    // console.log("inside useeffect get data");
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


   // delete food logs.
   const handleDeleteLog = async (meal, id) => {
    console.log("inside delete");
    dispatch(showLoader())
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      console.log("before update", getData);
      const mealdata = getData[meal].filter((mealId) => mealId.id != id);
      console.log(mealdata);
      await updateDoc(docRef, { [meal]: mealdata });

      const updatedDoc = (await getDoc(docRef)).data();
      setLogdata(updatedDoc);

      console.log("after update", getData);
      console.log("meal deleted");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader())
    }
  };


  const handleEditData= async (meal,id)=>{
   
    dispatch(showLoader())
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      console.log("before update", getData);
      const mealdata = 
      console.log(mealdata);
      await updateDoc(docRef, { [meal]: mealdata });

      const updatedDoc = (await getDoc(docRef)).data();
      setLogdata(updatedDoc);

      console.log("after update", getData);
      console.log("meal deleted");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader())
    }
  }

    // required calorie
    const dailyRequiredCalorie = async () => {
      dispatch(showLoader())
      const currentUser = auth.currentUser;
      const userId = currentUser?.uid;
  
      if (userId) {
        const userDocRef = doc(db, "users", userId);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setDailyCalorie(data.calorie);
          } else {
            setDailyCalorie(null);
          }
        } catch (error) {
          console.error("Error fetching calorie data:", error);
        } finally {
          dispatch(hideLoader())
        }
      }
    };
  
    useEffect(() => {
      dailyRequiredCalorie();
    }, [dailycalorie]);
  
    console.log("dailyrequiredcalorie", dailycalorie);
  // Meal details in nutrientwise

  const calculateCalories =
    selectedFoodData?.foods?.length > 0
      ? (selectedFoodData?.foods[0].nf_calories /
      selectedFoodData?.foods[0].serving_weight_grams) *
        selectquantity *
        quantity
      : "no data";

  const protein =
  selectedFoodData?.foods.length > 0
      ? calculateCalories /
        (selectedFoodData?.foods[0].nf_calories /
        selectedFoodData?.foods[0].nf_protein)
      : "no data";

  const carbs =
  selectedFoodData?.foods.length > 0
      ? calculateCalories /
        (selectedFoodData?.foods[0].nf_calories /
        selectedFoodData?.foods[0].nf_total_carbohydrate)
      : "no data";

  const fats =
  selectedFoodData?.foods.length > 0
      ? calculateCalories /
        (selectedFoodData?.foods[0].nf_calories /
        selectedFoodData?.foods[0].nf_total_fat)
      : "no data";

  //Meal Details in Calorie

  const calculateMealCalories = (mealData) => {
    return mealData?.length > 0
      ? mealData.reduce((total, item) => total + item.calories, 0)
      : 0;
  };

  const breakfastCalorie = calculateMealCalories(logData?.Breakfast);
  const lunchCalorie = calculateMealCalories(logData?.Lunch);
  const snackCalorie = calculateMealCalories(logData?.Snack);
  const dinnerCalorie = calculateMealCalories(logData?.Dinner);

  const totalCalories =
    breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;


  // const requiredCarlorie =  dailycalorie - totalCalories;

  const requiredCarlorie = 2000 - totalCalories;
  //pie chart

  const chartData = {
    labels: ["BreakFast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "#BCD18A",
          "#D1C28A",
        ],
        borderWidth: 1,
      },
    ],
  };

  //doughnut Data

  const doughnutdata = {
    labels: ["Consumed Calorie", "Required Calorie"],
    datasets: [
      {
        label: ["RequiredCalorie"],
        data: [totalCalories, requiredCarlorie],
        backgroundColor: ["rgb(54, 162, 235)", "#afc0d9"],
        hoverOffset: 1,
      },
    ],
  };

  const getPercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2);
  };

  const total = doughnutdata.datasets[0].data.reduce(
    (sum, value) => sum + value,
    0
  );

  const bardata = {
    labels: ["Meals Details"],
    datasets: [
      {
        label: "BreakFast",
        backgroundColor: "blue",
        data: [breakfastCalorie],
      },
      {
        label: "Lunch",
        backgroundColor: "red",
        data: [lunchCalorie],
      },
      {
        label: "Snack",
        backgroundColor: "balck",
        data: [snackCalorie],
      },
      {
        label: "Dinner",
        backgroundColor: "red",
        data: [dinnerCalorie],
      },
    ],
  };
  const options = {
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    responsive: true,
  };

 

  //NutrionalModal
  const handleOpenModal = async (foodName) => {
    await foodData(foodName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setSelectedFoodData(null);
  };

  //  console.log("protein",protein)
  //  console.log("carbs",carbs)
  //  console.log("fats",fats)
  return (
    <>
      <Navbar />
      <div className="search">
        <h1 id="header-text">Select a food item</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelect}
          onInputChange={handleSearch}
          placeholder="Search here ..."
        />
      </div>
    
     < Modal  isOpen={modal}>
       <MealModal
        modal={modal}
        setModal={setModal}
        quantity={quantity}
        setQuantity={setQuantity}
        selectquantity={selectquantity}
        setSelectquantity={setSelectquantity}
        selectedFoodData={selectedFoodData}
        setSelectCategory={setSelectCategory}
        calculateCalories={calculateCalories}
        handleModalData={handleModalData}
      />
    </Modal>
      <section className="view-data">
        <div className="meal-log">
          <h2>Your Food Diary</h2>

          <div className="meal-section">
            <h3>Breakfast :{breakfastCalorie} kcal</h3>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Proteins (g)</th>
                  <th>Carbs (g)</th>
                  <th>Fats (g)</th>
                  <th>Calories (kcal)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logData?.Breakfast?.length > 0 ? (
                  logData.Breakfast.map((item, index) => (
                    <tr key={`breakfast-${index}`}>
                      <td>
                        <button
                          style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleOpenModal(item.name)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteLog("Breakfast", item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No breakfast items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="meal-section">
            <h3>Lunch :{lunchCalorie} kcal</h3>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Proteins (g)</th>
                  <th>Carbs (g)</th>
                  <th>Fats (g)</th>
                  <th>Calories (kcal)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logData?.Lunch?.length > 0 ? (
                  logData.Lunch.map((item, index) => (
                    <tr key={`lunch-${index}`}>
                      <td>
                        <button
                          style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleOpenModal(item.name)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteLog("Lunch", item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No lunch items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="meal-section">
            <h3>Snack :{snackCalorie} kcal</h3>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Proteins (g)</th>
                  <th>Carbs (g)</th>
                  <th>Fats (g)</th>
                  <th>Calories (kcal)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logData?.Snack?.length > 0 ? (
                  logData.Snack.map((item, index) => (
                    <tr key={`snack-${index}`}>
                      <td>
                        <button
                          style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleOpenModal(item.name)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteLog("Snack", item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No snack items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="meal-section">
            <h3>Dinner :{dinnerCalorie} kcal</h3>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Proteins (g)</th>
                  <th>Carbs (g)</th>
                  <th>Fats (g)</th>
                  <th>Calories (kcal)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logData?.Dinner?.length > 0 ? (
                  logData.Dinner.map((item, index) => (
                    <tr key={`dinner-${index}`}>
                      <td>
                        <button
                          style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleOpenModal(item.name)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteLog("Dinner", item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No dinner items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="bar-chart-container">
      <Bar data={chartData}  />
    </div> */}

        <div className="total-calorie">
          <h2 style={{ marginRight: "1%" }}>
            {" "}
            Today Calorie Consumption :{totalCalories} kcal
          </h2>

          <div className="doughnut-data">
            <Doughnut data={doughnutdata} />
          </div>
          <div className="doughnut-text">
            {doughnutdata.labels.map((label, index) => {
              const value = doughnutdata.datasets[0].data[index];
              const percentage = getPercentage(value, total);
              return (
                <div key={index} className="doughnut-text-item">
                  <strong>{label}:</strong> {value}g ({percentage}%)
                </div>
              );
            })}
          </div>
        </div>

        {/* <Bar data={bardata} options={options}/> */}
      </section>

      <Modal isOpen={isModalOpen}>
        <NutritionModal
          onClose={handleCloseModal}
          foodData={selectedFoodData}
        />
      </Modal>
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
