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
import Progress from 'rsuite/Progress';
import 'rsuite/Progress/styles/index.css';

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
 const [dataUpdated,setDataUpdated]= useState(false)


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

  

  const style = {
    width: 120,
    display: 'inline-block',
    marginRight: 10
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
 

  const progressPercent = Math.floor((totalCalories / dailycalorie) * 100);


  //doughnut Data 

  const doughnutdata = {
    labels: ["Breakfast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          "rgb(255, 99, 132)",
         
          "rgb(54, 162, 235)",
          "#afc0d9",
          "#D1C28A",
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

  // drinkdata modal
  const getDrinkData = async (user) => {
    console.log("inside drinkData");
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
        const getData = docSnap.data();
        setDrinkData(getData);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getDrinkData(user);
      if (user) {
      } else {
        console.log("No user authenticated");
      }
    });
    return () => unsubscribe();
  }, [dataUpdated]);

  const handleDataUpdated = () => {
    setDataUpdated((prev) => !prev); 
  };

  const calculateTotals = () => {
  const calculateDrinkTotals = (drinkData) => {
    return drinkData?.length > 0
      ? drinkData.reduce((total, item) => total + item.totalAmount, 0)
      : 0;
  };
  setTotalWater(calculateDrinkTotals(drinkData?.Water));
  setTotalAlcohol(calculateDrinkTotals(drinkData?.Alcohol));
  setTotalCaffeine(calculateDrinkTotals(drinkData?.Caffeine));

}
  
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
        <h1 id="header-text">Search  Your Meals Below</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelect}
          onInputChange={handleSearch}
          placeholder="Search here ..."
          className="search-bar"
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
        <Modal isOpen={imageModal}   >
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
              <strong>BreakFast :</strong> {breakfastCalorie} kcal
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
            <label className="table-label"><strong>Lunch :</strong>{lunchCalorie} kcal</label>
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
            <label className="table-label"><strong>Snack :</strong>{snackCalorie} kcal</label>
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
            <label className="table-label"> <strong>Dinner :</strong>{dinnerCalorie} kcal</label>
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



   
        <div className="progress-line" style={{height:'20vh', width:"50vw", }}>
        <h2
            style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}
          >
            {" "}
            Today Progress Report
          </h2>

      <Progress.Line percent={progressPercent}  status="active"  strokeColor="#e15f41"  />


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
              onDataUpdated= {handleDataUpdated}
          />
        </Modal>

        <div style={{ width: "100%", margin: "20px auto" }}>
  {/* <h2 style={{ textAlign: "center", color: "#2980b9" }}>Drink Details</h2> */}
  <table
    style={{
      width: "40%",
      borderCollapse: "collapse",
      textAlign: "center",
      fontSize: "1rem",
      color: "#2c3e50",
      marginTop: "10px",
      marginLeft:"30%",
      borderRadius:"2px"
    }}
  >
    <thead>
      <tr style={{ backgroundColor: "#f4f6f7" }}>
        <th style={{ padding: "7px", border: "1px solid #ddd",color:"white" ,backgroundColor:"#aa6f5e" ,borderRadius:'2px'}}>Drink</th>
        <th style={{ padding: "7px", border: "1px solid #ddd",color:"white" ,backgroundColor:"#aa6f5e" ,borderRadius:'2px' }}>Total Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: "12px", border: "1px solid #ddd" }}>
          <img
            src="./src/assets/images/glass-of-water.png"
            alt="Water"
            style={{ height: "60px" }}
          />
          <p style={{ margin: "2px 0", fontWeight: "bold" }}>Water</p>
        </td>
        <td style={{ padding: "12x", border: "1px solid #ddd" }}>{totalWater} ml</td>
      </tr>
      <tr style={{ backgroundColor: "#f9f9f9" }}>
        <td style={{ padding: "12px", border: "1px solid #ddd" }}>
          <img
            src="./src/assets/images/beer.png"
            alt="Alcohol"
            style={{ height: "60px" }}
          />
          <p style={{ margin: "2px 0", fontWeight: "bold" }}>Alcohol</p>
        </td>
        <td style={{ padding: "12px", border: "1px solid #ddd" }}>{totalAlcohol} ml</td>
      </tr>
      <tr>
        <td style={{ padding: "12px", border: "1px solid #ddd" }}>
          <img
            src="./src/assets/images/coffee.png"
            alt="Caffeine"
            style={{ height: "60px" }}
          />
          <p style={{ margin: "2px 0", fontWeight: "bold" }}>Caffeine</p>
        </td>
        <td style={{ padding: "12px", border: "1px solid #ddd" }}>{totalCaffeine} ml</td>
      </tr>
    </tbody>
  </table>
</div>

      </div>

{/* 
      <div className="progress-line" style={{height:'20vh', width:"70vw", marginLeft:"15%"}}>
<Progress.Line percent={(requiredCarlorie/totalCalories)*100}   />


   </div> */}
      <Footer className="footer" />
    </>
  );
};

export default Home;
