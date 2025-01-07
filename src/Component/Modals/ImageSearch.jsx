import React, { useEffect, useRef, useState } from "react";
import "./ImageSearch.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import axios from "axios";
import GlobalSelect from "../Page-Components/Globalselect";
import {  toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import useThrottle from "../Hooks/useThrottle";
const ImageSearch = ({
  setImageModal,
  setImageData,
  handleGetData,
  // setSelectCategory,
  // handelImageSearchModal,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [mealCategory ,setMealCategory] = useState();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState();



  const apiUrl = `https://api.logmeal.com/v2/image/segmentation/complete`;
  const [errors, setErrors] = useState({
    quantity: "",
    mealCategory: "",
  });



  // Validate Quantity
  const validateQuantity = (value) => {
    if (!value || value <= 0) {
      return "Please enter a valid quantity.";
    }
    return "";
  };

// Validate Meal Category
const validateMealCategory = (value) => {
  if (!value) {
    return "Please choose a meal category.";
  }
  return "";
};

const handleBlur = (e) => {
  const { name, value } = e.target;
  const newErrors = { ...errors };

  // Trigger validation on blur
  if (name === "quantity") {
    newErrors.quantity = validateQuantity(value);
  }
  
  if (name === "selectCategory") {
    newErrors.selectCategory = validateMealCategory(value);
  }

  setErrors(newErrors);
};

//save the meal details into firebase
const handleSaveData = (e) => {
  e.preventDefault();

  dispatch(showLoader());

  const newErrors = {
    quantity: validateQuantity(quantity),
    mealCategory: validateMealCategory(mealCategory),
  };

  setErrors(newErrors);

  if (Object.values(newErrors).every((error) => !error)) {
    const newData = {
      id: Date.now(),
      name: name,
      calories: calories,
      proteins: protein,
      carbs: carbohydrates,
      fats: fat,
    };
    setImageData(newData);
    handelImageSearchModal(newData);
  
    dispatch(hideLoader());
    toast.success("Meal Added Successfully");
  } else {
   
    dispatch(hideLoader());
  }
};


const throttledHandleSaveData = useThrottle((e) => {
  dispatch(showLoader());
  handleSaveData(e);
}, 1000);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setSelectedFile(file);
  };

  //set the meal details 
  const handelImageSearchModal = async (data) => {

    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user?.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", userId, "dailyLogs", date);
        const categorisedData = { [mealCategory]: arrayUnion(data) };

        await setDoc(docRef, categorisedData, { merge: true });
        await handleGetData(user);
        
        setImageModal(false);
      } else {
       
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      dispatch(hideLoader());
    }
  };


  
  // ImageID API
  const handleUpload = async () => {
    setImageData();
    dispatch(showLoader());
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const result = await axios.post(
        `https://api.logmeal.com/v2/image/segmentation/complete`,
        formData,
        {
          headers: {
            Authorization: import.meta.env.VITE_LOGMEAL_API_TOKEN,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageId(result.data?.imageId);
   
    } catch (error) {
    toast.error("Please upload a valid food Image")
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (imageId) {
      fetchNutritionInfo(imageId);
    }
  }, [imageId]);

  // Nutritioninfo api
  const fetchNutritionInfo = async (imageId) => {
    const data = { imageId: imageId };
    try {
      const result = await axios.post(
        `https://api.logmeal.com/v2/nutrition/recipe/nutritionalInfo`,
        data,
        {
          headers: {
            Authorization: import.meta.env.VITE_LOGMEAL_API_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      setNutritionInfo(result.data);
    } catch (error) {
      toast.error("Please upload a valid food image");
      console.log(error);
    }
  };

  useEffect(() => {

    if (nutritionInfo) {
      setName(nutritionInfo?.foodName[0] || "");
      setCalories(
        Math.floor(nutritionInfo?.nutritional_info?.calories) * quantity || 0
      );
      setCarbohydrates(
        Math.floor(
          nutritionInfo?.nutritional_info?.totalNutrients?.CHOCDF?.quantity
        ) * quantity || 0
      );
      setFat(
        Math.floor(
          nutritionInfo?.nutritional_info?.totalNutrients?.FAT?.quantity
        ) * quantity || 0
      );
      setProtein(
        Math.floor(
          nutritionInfo?.nutritional_info?.totalNutrients?.PROCNT?.quantity
        ) * quantity || 0
      );
    }

  }, [nutritionInfo, quantity]);


  const mealOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snack", label: "Snack" },
    { value: "Dinner", label: "Dinner" },
  ];



  return (
    <>
      <span
        className="close-button"
        onClick={() => setImageModal(false)}
        style={{
          color: "black",
          backgroundColor: "white",
          padding: "5px",
          cursor: "pointer",
        }}
      >
        X
      </span>

      <div className="image-search-container">
        <h2 className="title"> Recognize Food Facts</h2>

        <div className="upload-section">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {imageSrc && (
          <div className="image-preview">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Uploaded Preview"
              className="preview-image"
            />
          </div>
        )}

        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>

        {nutritionInfo && (
          <div>
            <h2>Nutrition Information</h2>
            <h3>{name}</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                fontSize: "1rem",
                color: "#2c3e50",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f4f6f7" }}>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #ddd" }}
                  >
                    Nutrient
                  </th>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #ddd" }}
                  >
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Calories
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {calories} kcal
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Carbohydrates
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {carbohydrates} g
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Fat
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {fat} g
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    Protein
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {protein} g
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: "30px" }}>
              {/* <label className="meal-label" >Choose Meal</label> */}

              <label className="meal-label">Choose Meal</label>
        <GlobalSelect
          options={mealOptions}
          value={mealOptions.find((option) => option.value === mealCategory)}
          onChange={(selectedOption) => setMealCategory(selectedOption.value)}
          onBlur={handleBlur} 
        />
        {errors.mealCategory && <div style={{ color: "red" }}>{errors.mealCategory}</div>}

            </div>  

            <div className="input-container">
          <label>Choose Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onBlur={handleBlur} 
            step="1"
          />
          {errors.quantity && <div style={{ color: "red" }}>{errors.quantity}</div>}
        </div>


            <div>
              <p className="calorie-info">
                Calorie Served: {calories || "N/A"}
              </p>
              <button className="add-meal-button" onClick={throttledHandleSaveData}>
                Add Meal
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageSearch;
