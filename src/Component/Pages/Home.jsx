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
import { FaTrashAlt, FaEdit, FaSearch } from "react-icons/fa";
import {
  useAddMealMutation,
  useFetchSuggestionsQuery,
} from "../../Redux/foodApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import MealModal from "../Modals/MealModal";
import NutritionModal from "../Modals/NutritionModal";
import EditDataModal from "../Modals/EditDataModal";
import ImageSearch from "./ImageSearch";
import DrinkModal from "../Modals/DrinkModal";



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
  const [editModal, setEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [editMealName, setEditMealName] = useState();
  const [foodMeasure, setFoodMeasure] = useState();
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [imageData, setImageData] = useState();
  const [drinkData,setDrinkData]= useState();
  const [totalWater,setTotalWater] = useState();
 const [totalAlcohol,setTotalAlcohol] = useState();
 const [totalCaffeine, setTotalCaffeine] =useState();

  const loader = useSelector((state) => state.loaderReducer.loading);
  const { caffeine, alcohol, water } = useSelector(
    (state) => state.waterReducer
  );

  // console.log(totalWater)
  const dispatch = useDispatch();
  
  //food suggestion search bar
  const {
    data: suggestions,
    isLoading,
    isError,
  } = useFetchSuggestionsQuery(inputValue);

  const handleSearch = (query) => {
    setInputValue(query);
  };

  const groupedOptions = [
    {
      label: "Common Foods",
      options: suggestions?.common.map((element, index) => ({
        value: element.tag_id + index,
        label: `${element.food_name}`,
        category: "common",
      })),
    },
    {
      label: "Branded Foods",
      options: suggestions?.branded.map((element, index) => ({
        value: element.nix_item_id + index,
        label: `${element.brand_name_item_name} - ${element.nf_calories} kcal`,
        category: "Branded",
      })),
    },
  ];

  // console.log("grouped Option", groupedOptions);
  //add food
  const [addMeal, { data: selectedFoodData }] = useAddMealMutation();

  const handleSelect = (selectedOption) => {
    setSelectItem(selectedOption);
    if (selectedOption) {
      addMeal(selectedOption?.label);
    }
    setModal(true);
  };

  // Add Meal data

  const handleModalData = async () => {
    try {
      dispatch(showLoader());
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
      dispatch(hideLoader());
    }
  };

  //get user mealdata
  const handleGetData = async (user) => {
    try {
      // console.log("user", user)
      dispatch(showLoader());
      if (!user) {
        console.log("User is not authenticated");

        return;
      }
      const userId = user.uid;

      const date = new Date().toISOString().split("T")[0];

      const docRef = doc(db, "users", userId, "dailyLogs", date);

      const docSnap = await getDoc(docRef);
      // console.log("getdata", docSnap.data());
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
      dispatch(hideLoader());
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
    dispatch(showLoader());
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
      dispatch(hideLoader());
    }
  };
  // console.log("selectedFood", selectedFoodData);

  // console.log("selected quantity", selectquantity);

  const handleEditLog = async (meal, name, id) => {
    setSelectedId(id);
    setEditMealName(meal);
    dispatch(showLoader());
    addMeal(name);
    setEditModal(true);
    dispatch(hideLoader());
    console.log("id", id);
  };

  console.log("selecteditem", selectItem?.label);

  const handleEditModalData = async () => {
    console.log("insdie edit");
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const data = {
        id: selectedId,
        name: selectedFoodData?.foods[0]?.food_name,
        calories: Math.round(calculateCalories),
        proteins: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      };
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      console.log("before update", getData);
      const mealdata = getData[editMealName].filter(
        (meal) => meal.id != selectedId
      );
      console.log("mealData", mealdata);
      await updateDoc(docRef, { [editMealName]: mealdata });

      const newData = { [selectCategory]: arrayUnion(data) };
      await updateDoc(docRef, newData);
      const updatedDoc = (await getDoc(docRef)).data();
      setLogdata(updatedDoc);
      console.log("updated doc", updatedDoc);
    } catch (error) {
      console.log(error);
    } finally {
      setEditModal(false);
      dispatch(hideLoader());
    }
  };

  // required calorie
  const dailyRequiredCalorie = async () => {
    dispatch(showLoader());
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
        dispatch(hideLoader());
      }
    }
  };

  useEffect(() => {
    dailyRequiredCalorie();
  }, [dailycalorie]);

  // Meal details in nutrientwise

  const calculateCalories =
    selectedFoodData?.foods?.length > 0
      ? (selectedFoodData?.foods[0].nf_calories /
          selectedFoodData?.foods[0].serving_weight_grams) *
        selectquantity *
        quantity
      : "no data";
  // console.log("calculated calorie", calculateCalories);

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

  const requiredCarlorie = dailycalorie - totalCalories;

  //pie chart

  const chartData = {
    labels: ["Consumed Calorie", "Required Calorie"],
    datasets: [
      {
        label: ["RequiredCalorie"],
        data: [totalCalories, requiredCarlorie],
        backgroundColor: ["#e77f67"],
        hoverOffset: 1,
      },
    ],
  };

  const totalConsumedCalories = totalCalories;
  const remainingCalories = Math.max(
    requiredCarlorie - totalConsumedCalories,
    0
  ); 

  // Calculate the total calories consumed from the dataset
  const totalCaloriesFromDataset = chartData.datasets[0].data.reduce(
    (a, b) => a + b,
    0
  );

  //doughnut Data

  const doughnutdata = {
    labels: ["Breakfast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "#e66767", // Dinner
        ],
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

  const handleNutritionModal = (foodDetail) => {
    addMeal(foodDetail);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setSelectedFoodData(null);
  };

  const [imageModal, setImageModal] = useState(false);

  const handelImageSearchModal = async (data) => {
    console.log("inside handleimage", data);

    try {
      dispatch(showLoader());
      const user = auth.currentUser;
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
      setImageModal(false);
      dispatch(hideLoader());
    }
  };

 
  const getDrinkData = async (user) => {
    try {
      dispatch(showLoader());
      if (!user) {
        console.log("User is not authenticated");
        return;
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const drinkData = docSnap.data();
        setDrinkData(drinkData);
      } else {
        setDrinkData({});
      }
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    console.log("inside the getDrink data")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getDrinkData(user);
      if (user) {
    //  dispatch(showLoader())
      } else {
        console.log("No user authenticated");
        setloading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateTotals = () => {
    const waterTotal = drinkData?.water?.reduce((acc, item) => acc + item.totalAmount, 0) || 0;
    const alcoholTotal = drinkData?.alcohol?.reduce((acc, item) => acc + item.totalAmount, 0) || 0;
    const caffeineTotal = drinkData?.caffeine?.reduce((acc, item) => acc + item.totalAmount, 0) || 0;
   

    console.log("water",waterTotal)
    // Update state after calculations
    setTotalWater(waterTotal);
    setTotalAlcohol(alcoholTotal);
    setTotalCaffeine(caffeineTotal);
  };

  // Calculate totals when drinkData changes
  useEffect(() => {
    if (drinkData) {
      calculateTotals();
    }
  }, [drinkData]);

  
  return (
    <>
      <Navbar />
      <div className="search">
        <h1 id="header-text">Enter Your Meals Below</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelect}
          onInputChange={handleSearch}
          placeholder="Search here ..."
        />
      </div>

      <div className="ai-search">
        <button
          className="ai-search-button"
          onClick={() => {
            setImageModal(true);
          }}
        >
          <span className="ai-search-button-icon">
            <FaSearch size={16} color="white" />
          </span>
          AI Food Search
        </button>
        <Modal isOpen={imageModal}>
          <ImageSearch
            setImageModal={setImageModal}
            setImageData={setImageData}
            setSelectCategory={setSelectCategory}
            handelImageSearchModal={handelImageSearchModal}
          ></ImageSearch>
        </Modal>
      </div>

      <Modal isOpen={modal}>
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
          setFoodMeasure={setFoodMeasure}
        />
      </Modal>

      <section className="view-data">
        <div className="meal-log">
          <h2
            style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.5rem" }}
          >
            {" "}
            Your Food Diary
          </h2>

          <div className="meal-section">
            <div>
              <label className="table-label">
                Breakfast : {breakfastCalorie} kcal
              </label>
            </div>

            <div>
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
                          <span onClick={() => handleNutritionModal(item.name)}>
                            {item.name}
                          </span>
                        </td>
                        <td>{item.proteins}</td>
                        <td>{item.carbs}</td>
                        <td>{item.fats}</td>
                        <td>{item.calories}</td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <span
                              onClick={() =>
                                handleDeleteLog("Breakfast", item.id)
                              }
                              className="icon-button delete"
                            >
                              <FaTrashAlt style={{ color: "#e15f41" }} />
                            </span>
                            <span
                              onClick={() =>
                                handleEditLog("Breakfast", item.name, item.id)
                              }
                              className="icon-button edit"
                            >
                              <FaEdit />
                            </span>
                          </div>
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
          </div>
          <div className="meal-section">
            <label className="table-label">Lunch :{lunchCalorie} kcal</label>
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
                        <span
                          // style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleNutritionModal(item.name)}
                        >
                          {item.name}
                        </span>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>

                      <div style={{ display: "flex" }}>
                        <span
                          onClick={() => handleDeleteLog("Lunch", item.id)}
                          className="icon-button delete"
                        >
                          <FaTrashAlt style={{ color: "#e15f41" }} />
                        </span>
                        <span
                          onClick={() =>
                            handleEditLog("Lunch", item.name, item.id)
                          }
                          className="icon-button edit"
                        >
                          <FaEdit />
                        </span>
                      </div>
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
            <label className="table-label">Snack :{snackCalorie} kcal</label>
            <table className="meal-table">
              <thead>
                <tr id="header-color">
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
                        <span
                          // style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleNutritionModal(item.name)}
                        >
                          {item.name}
                        </span>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      <div style={{ display: "flex" }}>
                        <span
                          onClick={() => handleDeleteLog("Snack", item.id)}
                          className="icon-button delete"
                        >
                          <FaTrashAlt style={{ color: "#e15f41" }} />
                        </span>
                        <span
                          onClick={() =>
                            handleEditLog("Snack", item.name, item.id)
                          }
                          className="icon-button edit"
                        >
                          <FaEdit />
                        </span>
                      </div>
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
            <label className="table-label">Dinner :{dinnerCalorie} kcal</label>
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
                        <span
                          // style={{ backgroundColor: "#0077b6" }}/
                          onClick={() => handleNutritionModal(item.name)}
                        >
                          {item.name}
                        </span>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      <div style={{ display: "flex" }}>
                        <span
                          onClick={() => handleDeleteLog("Dinner", item.id)}
                          className="icon-button delete"
                        >
                          <FaTrashAlt style={{ color: "#e15f41" }} />
                        </span>
                        <span
                          onClick={() =>
                            handleEditLog("Dinner", item.name, item.id)
                          }
                          className="icon-button edit"
                        >
                          <FaEdit />
                        </span>
                      </div>
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

        <div className="stacked-progress-bar-container">
          <h2
            style={{ marginTop: "7%", color: "darkgrey", fontSize: "2.5rem" }}
          >
            Progress Towards Daily Goal
          </h2>
          <div className="stacked-progress-bar">
            {doughnutdata.labels.map((label, index) => {
              const value = chartData.datasets[0].data[index];
              const percentage = (value / totalCaloriesFromDataset) * 100;
              const color = chartData.datasets[0].backgroundColor[index];

              return (
                <div
                  key={index}
                  className="progress-segment"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                  title={`${label}: ${value} kcal (${Math.round(percentage)}%)`}
                ></div>
              );
            })}

            {remainingCalories > 0 && (
              <div
                className="progress-segment"
                style={{
                  width: `${(remainingCalories / requiredCarlorie) * 100}%`,
                  backgroundColor: "#ccc",
                }}
                title={`Remaining Calories: ${remainingCalories} kcal`}
              ></div>
            )}

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p>
                <strong>Total Consumed Calories:</strong>{" "}
                {totalConsumedCalories} kcal
              </p>
              <p>
                <strong>Required Calories:</strong> {requiredCarlorie} kcal
              </p>
            </div>
          </div>

          <div className="stacked-progress-labels">
            {chartData.labels.map((label, index) => (
              <div key={index} className="label-item">
                <span
                  className="label-color"
                  style={{
                    backgroundColor:
                      chartData.datasets[0].backgroundColor[index],
                  }}
                ></span>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="total-calorie">
          <h2
            style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.5rem" }}
          >
            {" "}
            Your Calorie Journey Today
          </h2>
          <div className="doughnut-data">
            <div className="doughnut-graph">
              <Doughnut data={doughnutdata} />
            </div>
            <div className="doughnut-text">
              {doughnutdata.labels.map((label, index) => {
                const value = doughnutdata.datasets[0].data[index];
                const percentage = getPercentage(value, total);
                return (
                  <div key={index} className="doughnut-text-item">
                    <strong>{label}:</strong> {value} kcal ({percentage}%)
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* <Bar data={bardata} options={options}/> */}
      </section>

      <Modal isOpen={editModal}>
        <EditDataModal
          setModal={setEditModal}
          quantity={quantity}
          setQuantity={setQuantity}
          selectquantity={selectquantity}
          setSelectquantity={setSelectquantity}
          selectedFoodData={selectedFoodData}
          setSelectCategory={setSelectCategory}
          calculateCalories={calculateCalories}
          handleEditModalData={handleEditModalData}
        />
      </Modal>

      <Modal isOpen={isModalOpen}>
        <NutritionModal
          onClose={handleCloseModal}
          foodData={selectedFoodData}
          calories={Math.round(calculateCalories)}
          proteins={Math.round(protein)}
          carbs={Math.round(carbs)}
          fats={Math.round(fats)}
        />
      </Modal>

      <div className="drink-section">
        <h2 style={{ color: "darkgrey", fontSize: "2.5rem" }}>
          Water and Beverages Intake
        </h2>
        <button
          className="ai-search-button"
          onClick={() => setShowDrinkModal(true)}
        >
          Add Drink
          <span className="ai-search-button-icon">
            <FaSearch size={16} color="white" />
          </span>
        </button>

        <Modal isOpen={showDrinkModal}>
          <DrinkModal
            setShowDrinkModal={setShowDrinkModal}
  
          />
        </Modal>

        <div className="drink-details">
          <label htmlFor="">
            {" "}
            <img
              src="./src/assets/images/glass-of-water.png"
              alt=""
              style={{ height: "60px" }}
            />
            {totalWater}ml
          </label>

          <label htmlFor="">
            {" "}
            <img
              src="./src/assets/images/beer.png"
              alt=""
              style={{ height: "60px" }}
            />{" "}
            {totalAlcohol}ml
          </label>
          <label htmlFor="">
            {" "}
            <img
              src="./src/assets/images/coffee.png"
              alt=""
              style={{ height: "60px" }}
            />{" "}
            {totalCaffeine}ml
          </label>
        </div>
      </div>
      <Footer className="footer" />
    </>
  );
};

export default Home;
