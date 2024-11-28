import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce, max } from "lodash";
import Select from "react-select";
import Modal from "react-modal";
const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState({ common: [], branded: [] });
  const [selectItem, setSelectItem] = useState({});
  const [modal, setModal] = useState(false);
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [snack, setSnack] = useState([]);
  const [serveCalorie, setServeCalorie] = useState(0); //for item select
  const [TotalCalorie, setTotalcalorie] = useState(0);
  const [selectquantity, setSelectquantity] = useState(0);
  const [mealQuantity, setMealQuantity] = useState(1);
  const [SelectedFoodData, setSelectedFoodData] = useState({ foods: [] });
  const [selectCategory, setSelectCategory] = useState("");

  // API Data on serch bar

  const debouncedFetchSuggestions = debounce(async (query) => {
    try {
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant/?query=${query}`,
        {
          headers: {
            "x-app-id": "0d7c04b7",
            "x-app-key": "c643c4d194390f87b154278db24af26b",
            "Content-Type": "application/json",
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 300);

  //push method for nutrients

  const foodData = async (select) => {
    try {
      console.log("inside foodData");
      const response = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          query: `${select}`,
        },
        {
          headers: {
            "x-app-id": "0d7c04b7",
            "x-app-key": "c643c4d194390f87b154278db24af26b",
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

  const handleModalData = () => {
    if (selectCategory === "Breakfast") {
      setBreakfast((prev) => [
        ...prev,
        {
          name: selectItem.label,
          quantity: selectquantity,
          calories: calculateCalories,
        },
      ]);
    } else if (selectCategory === "Lunch") {
      setLunch((prev) => [
        ...prev,
        {
          name: selectItem.label,
          quantity: selectquantity,
          calories: Math.floor(calculateCalories),
        },
      ]);
    } else if (selectCategory === "Snack") {
      setSnack((prev) => [
        ...prev,
        {
          name: selectItem.label,
          quantity: selectquantity,
          calories: Math.floor(calculateCalories),
        },
      ]);
    } else if (selectCategory === "Dinner") {
      setDinner((prev) => [
        ...prev,
        {
          name: selectItem.label,
          quantity: selectquantity,
          calories: Math.floor(calculateCalories),
        },
      ]);
    }

    setModal(false);
  };

  const calculateCalories =
    SelectedFoodData.foods.length > 0
      ? (SelectedFoodData.foods[0].nf_calories /
          SelectedFoodData.foods[0].serving_weight_grams) *
        selectquantity
      : "no data";

      
 
   const totalcalorieHandler = () => {
    const combine = [ ...breakfast,...lunch,...snack,...dinner]
    return combine.reduce((acc, item) => acc + (item.calories || 0), 0);
  };
  

 console.log("total",totalcalorieHandler());

 console.log(selectCategory);
  console.log(breakfast);
  console.log(lunch);
  return (
    <>
      <h1>Nutrition-Tracker</h1>

      <Select
        options={groupedOptions}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        placeholder="Select a food item"
      />

      <Modal
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

        <b>{selectItem.label}</b>

        <input
          type="text"
          placeholder="1"
          value={inputValue}
          onChange={(e) => setSelectquantity(e.target.value)}
        />

        <br />

        <select
          onChange={(e) => {
            const selectedMeasure = e.target.value;

            console.log(selectedMeasure);
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
        <p>Calorie:{calculateCalories}</p>

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
          <option value="" selected disabled hidden>Choose here</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snack">Snack</option>
          <option value="Dinner">Dinner</option>
        </select>
        <button onClick={handleModalData}> Add Meal</button>

        <button onClick={()=>  setModal(false)}>x</button>
      </Modal>

<h3> Total Calorie Consumption :{totalcalorieHandler()}</h3>
 <br />
 <span>Min: 0</span>
      <input 
      id="typeinp" 
      type="range" 
      min="0" max="2000" 
      value={totalcalorieHandler()} 
      // onChange={ totalcalorieHandler()}
      />
     <span>Max:2000</span>

      <h3>Breakfast</h3>
      <ul>
        {breakfast.length > 0 ? (
          breakfast.map((item, index) => (
            <li key={index}>
              {item.name} - {item.calories} kcal
            </li>
          ))
        ) : (
          <li>No breakfast items</li>
        )}
      </ul>

      <h3>Lunch</h3>
      <ul>
        {lunch.length > 0 ? (
          lunch.map((item, index) => (
            <li key={index}>
              {item.name} - {item.calories} kcal
            </li>
          ))
        ) : (
          <li>No lunch items</li>
        )}
      </ul>

      <h3>Snacks</h3>
      <ul>
        {snack.length > 0 ? (
          snack.map((item, index) => (
            <li key={index}>
              {item.name} - {item.calories} kcal
            </li>
          ))
        ) : (
          <li>No snacks item</li>
        )}
      </ul>

      <h3>Dinner</h3>
      <ul>
        {dinner.length > 0 ? (
          dinner.map((item, index) => (
            <li key={index}>
              {item.name} - {item.calories} kcal
            </li>
          ))
        ) : (
          <li>No dinner item</li>
        )}



      </ul>
    </>
  );
};

export default Home;


