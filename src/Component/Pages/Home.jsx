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
import Progress from "rsuite/Progress";
import "rsuite/Progress/styles/index.css";
import { Notification } from 'rsuite';
import 'rsuite/Notification/styles/index.css';
import { setSignout, setSignup } from "../../Redux/logSlice";
import SetCalorieModal from "../Modals/SetCalorieModal";
import Table from "../Page-Components/Table";
import Image from "../Image/Image";

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
  const [drinkData, setDrinkData] = useState();
  const [totalWater, setTotalWater] = useState();
  const [totalAlcohol, setTotalAlcohol] = useState();
  const [totalCaffeine, setTotalCaffeine] = useState();
  const [dataUpdated, setDataUpdated] = useState(false);
  const [energyModal,setEnergyModal] = useState(false);
  

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
    display: "inline-block",
    marginRight: 10,
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
      <Stack spacing={10} direction="column" alignItems="flex-start">
      <Notification type="success" header="Operation successful">
      The email has been sent successfully, please check it in the mailbox.
    </Notification>
    </Stack>
    }
  };



  const handleEditLog = async (meal, name, id) => {
    setSelectedId(id);
    setEditMealName(meal);
    dispatch(showLoader());
    addMeal(name);
    setEditModal(true);
    dispatch(hideLoader());
    console.log("id", id);
  };

  // console.log("selecteditem", selectItem?.label);

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
    // dispatch(showLoader());
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
        // dispatch(hideLoader());
      }
    }
  };

  useEffect(() => {
    dailyRequiredCalorie();
  }, [handleGetData]);

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
console.log("caloriecalculate",calculateCalories)
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

const calculateMealNutrient = (mealData, nutrient) => {
  return mealData?.length > 0
    ? mealData.reduce((total, item) => total + item[nutrient], 0)
    : 0;
};


const calculateMealCalories = (mealData) => {
  return calculateMealNutrient(mealData, "calories");
};


const calculateMealProtein = (mealData) => {
  return calculateMealNutrient(mealData, "proteins");
};

const calculateMealCarbs = (mealData) => {
  return calculateMealNutrient(mealData, "carbs");
};

const calculateMealFats = (mealData) => {
  return calculateMealNutrient(mealData, "fats");
};


const breakfastCalorie = calculateMealCalories(logData?.Breakfast);
const breakfastProtein = calculateMealProtein(logData?.Breakfast);
const breakfastCarbs = calculateMealCarbs(logData?.Breakfast);
const breakfastFats = calculateMealFats(logData?.Breakfast);

const lunchCalorie = calculateMealCalories(logData?.Lunch);
const lunchProtein = calculateMealProtein(logData?.Lunch);
const lunchCarbs = calculateMealCarbs(logData?.Lunch);
const lunchFats = calculateMealFats(logData?.Lunch);

const snackCalorie = calculateMealCalories(logData?.Snack);
const snackProtein = calculateMealProtein(logData?.Snack);
const snackCarbs = calculateMealCarbs(logData?.Snack);
const snackFats = calculateMealFats(logData?.Snack);

const dinnerCalorie = calculateMealCalories(logData?.Dinner);
const dinnerProtein = calculateMealProtein(logData?.Dinner);
const dinnerCarbs = calculateMealCarbs(logData?.Dinner);
const dinnerFats = calculateMealFats(logData?.Dinner);

// Calculate totals for the day
const totalCalories = breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;
const totalProtein = breakfastProtein + lunchProtein + snackProtein + dinnerProtein;
const totalCarbs = breakfastCarbs + lunchCarbs + snackCarbs + dinnerCarbs;
const totalFats = breakfastFats + lunchFats + snackFats + dinnerFats;



const calculateMacronutrients = (totalCalories) => {
  // Define percentage distribution
  const proteinPercent = 0.25;
  const carbsPercent = 0.50;   
  const fatsPercent = 0.25;   

  // Calculate  calorie allocation
  const proteinCalories = dailycalorie * proteinPercent;
  const carbsCalories = dailycalorie * carbsPercent;
  const fatsCalories = dailycalorie * fatsPercent;

  // Convert calories to grams
  const proteinGrams = Math.round(proteinCalories / 4); 
  const carbsGrams = Math.round(carbsCalories / 4);     
  const fatsGrams = Math.round(fatsCalories / 9);     

  return {
    proteinGrams,
    carbsGrams,
    fatsGrams,
  };
};

const { proteinGrams, carbsGrams, fatsGrams } = calculateMacronutrients(totalCalories);



  const requiredCalorie = dailycalorie > 0 ? dailycalorie - totalCalories : 0;

const progressPercent = dailycalorie > 0 ? Math.floor((totalCalories / dailycalorie) * 100) : 0;
const proteinPercentage =   Math.floor((totalProtein / proteinGrams) * 100);
const carbsPercentage = Math.floor((totalCarbs / carbsGrams) * 100);
const fatsPercentage = Math.floor((totalFats / fatsGrams) * 100);

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
  };

  // Calculate totals when drinkData changes
  useEffect(() => {
    if (drinkData) {
      calculateTotals();
    }
  }, [drinkData]);



  //energy modal
  const isSignup = useSelector((state) => state.loggedReducer.signedup);
  useEffect(() => {
    if (isSignup === true) {
      setEnergyModal(true); 
      //  dispatch(setSignout())
    }
  }, []);
  

  // console.log("signupmodal",isSignup)

  // console.log("signup",useSelector((state) => state.loggedReducer.signedup))
  return (
    <>
      <Navbar />
      <div className="search" style={{ backgroundImage: `url(${Image.bgSelectImage})` }}
>
        <h1 id="header-text">Search Your Meals Below</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelect}
          onInputChange={handleSearch}
          placeholder="Search here ..."
          className="search-bar"
        />
      </div>


<h2 style={{padding:'40px'}}>AI Food Vision: Identify Your Dish Instantly</h2>
      <div className="ai-search">
        
        <button
          className="ai-search-button"
          onClick={() => {
            setImageModal(true);
          }}
        >
          <span className="ai-search-button-icon">
            <FaSearch size={16} color="white" />
          </span>Visual Food Search
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

   {/* Energy Modal */}
     <div>
    <Modal isOpen={energyModal}>
     <SetCalorieModal
        setEnergyModal={setEnergyModal}
     />

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

      <Table
      logData={logData}
      handleNutritionModal={handleNutritionModal}
      handleEditLog={handleEditLog}
      handleDeleteLog={handleDeleteLog}
      showFeature={true}
      />

        <div
          className="progress-line"
          style={{ height: "auto", width: "50vw", marginLeft:"25%" }}
         >
          <h2
            style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}
          >
           
            Today Meal Progress Report
          </h2>
          <div style={{ margin: "20px 20px" }}>
            <label htmlFor="">
            
              <strong> Energy Calorie: </strong>
              {totalCalories}/{dailycalorie} kcal
            </label>
          <Progress.Line
            percent={progressPercent}
            status="active"
            strokeColor="#e15f41"
            /> 
             </div>
            <div style={{ margin: "20px 20px" }}>
            <label htmlFor="">
              <strong> Protein: </strong>
              {totalProtein}/{proteinGrams}g
            </label>
          <Progress.Line
            percent={proteinPercentage}
            status="active"
            strokeColor="#55a630"
            />
            </div>
            <div style={{ margin: "20px 20px" }}>
            <label htmlFor="">
              {" "}
              <strong> Carbs </strong>
              {totalCarbs}/{carbsGrams} g
            </label>
          <Progress.Line
            percent={carbsPercentage}
            status="active"
          strokeColor="355070"
            />
            </div>
            <div style={{ margin: "20px 20px" }}>
            <label htmlFor="">
              {" "}
              <strong> Fat: </strong>
              {totalFats}/{fatsGrams} g
            </label>
          <Progress.Line
            percent={fatsPercentage}
            status="active"
              strokeColor="#52b788"
            
            />
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
                const percentage =( value>0?Math.floor(getPercentage(value, total)) :0);
                return (
                  <div key={index} className="doughnut-text-item">
                    <strong>{label}:</strong> {value} kcal ({percentage}%)
                  </div>
                );
              })}
            </div>
          </div>
        </div>
     

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
          selectedFoodData={selectedFoodData}
          quantity={quantity}
          setQuantity={setQuantity}
          selectquantity={selectquantity}
          setSelectquantity={setSelectquantity}

          setSelectCategory={setSelectCategory}
          // calories={Math.round(calculateCalories)}
          // proteins={Math.round(protein)}
          // carbs={Math.round(carbs)}
          // fats={Math.round(fats)}
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
            onDataUpdated={handleDataUpdated}
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
              marginLeft: "30%",
              borderRadius: "2px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4f6f7" }}>
                <th
                  style={{
                    padding: "7px",
                    border: "1px solid #ddd",
                    color: "white",
                    backgroundColor: "#aa6f5e",
                    borderRadius: "2px",
                  }}
                >
                  Drink
                </th>
                <th
                  style={{
                    padding: "7px",
                    border: "1px solid #ddd",
                    color: "white",
                    backgroundColor: "#aa6f5e",
                    borderRadius: "2px",
                  }}
                >
                  Total Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={Image.water}
                    alt="Water"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>Water</p>
                </td>
                <td style={{ padding: "12x", border: "1px solid #ddd" }}>
                  {totalWater} ml
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={Image.beer}
                    alt="Alcohol"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>Alcohol</p>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {totalAlcohol} ml
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={Image.coffee}
                    alt="Caffeine"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                    Caffeine
                  </p>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {totalCaffeine} ml
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer className="footer" />
    </>
  );
};

export default Home;
