import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Select from "react-select";
import Modal from "react-modal";
const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState({ common: [], branded: [] });
  const [selectItem, setSelectItem] = useState({});
  const [modal, setModal] = useState(false);
  const [morning, setmorning] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [snack, setSnack] = useState([]);
  const [serveCalorie, setServeCalorie] = useState(0);
  const [TotalCalorie, setTotalcalorie] = useState(0);

  const [commonFoodData, setCommonFoodData] = useState([]);

  // API Data on serch bar
  const debouncedFetchSuggestions = debounce(async (query) => {
    try {
      // console.log("iside fetchsuggestion");
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
  }, 400);

  //  const  question = selectItem.label
  //  console.log(question);
  // API  Data for common food item
  const foodData = async (label = "") => {
    try {
      console.log("iside fooddata");
      const response = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          headers: {
            "x-app-id": "0d7c04b7",
            "x-app-key": "c643c4d194390f87b154278db24af26b",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: "",
          }),
        }
      );
      setCommonFoodData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (newInputValue) => {
    // console.log("inidde handleinput");
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

  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectItem(selectedOption);
    setModal(true);
  };

  const handleModal = () => {
    setModal(false);
  };

  const handleChange = (e) => {};
  // console.log(selectItem);
  //   console.log(suggestions);
  console.log(commonFoodData);

  return (
    <>
      <h1>Nutrition-Tracker</h1>

      <Select
        options={groupedOptions}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        placeholder="Select a food item"
        // getOptionLabel={(e) => e.label}
        // getOptionValue={(e) => e.value}
      />

      <Modal
        isOpen={modal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            background: "#fff",
            padding: "20px",
            width: "400px",
            marginLeft: "auto",
            borderRadius: "10px",
          },
        }}
      >
        <h2>Your Meal</h2>

        <b>{selectItem.label}</b>

        <input type="text" placeholder="quantity" onChange={handleChange} />

        <br />
        <select name="food-item" id="food-item" onChange={handleSelectChange}>
          <option disabled>Select a serving unit</option>
          {suggestions.common
            .filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (element) => element.serving_unit === item.serving_unit
                )
            )
            .map((item, index) => (
              <option key={`${item.tag_id}-${index}`} value={item.serving_unit}>
                {item.serving_unit}
              </option>
            ))}
        </select>

        <br />
        <select name="meal-category" id="meal-category">
          {" "}
          <option value="">Breakfast</option>
          <option value="">Lunch</option>
          <option value="">Snack</option>
          <option value="">Dinner</option>
        </select>
        <button onClick={handleModal}> Add Meal</button>
      </Modal>
    </>
  );
};

export default Home;
