import React, { useRef, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./ImageSearch.css";
import Navbar from "./../Page-Components/Navbar";
import Footer from "./../Page-Components/Footer";
import Loader from "./../Page-Components/Loader";
import { useAddMealMutation } from "../../Redux/foodApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import "@tensorflow/tfjs-backend-webgl";
import axios from "axios";

const ImageSearch = ({
  setImageModal,
  setImageData,
  setSelectCategory,
  handelImageSearchModal,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const loader = useSelector((state) => state.loaderReducer.loading);

  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [imageId, setImageId] = useState();
  const [nutritionInfo, setNutritionInfo] = useState();
  const [mealQuantity, setMealQuantity] = useState();
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

  const handleSaveData = () => {
    setImageData({
      id: Date.now(),
      name: name,
      calories: calories,
      proteins: protein,
      carbs: carbohydrates,
      fats: fat,
    });
  };


  // ImageID API
  const handleUpload = async () => {
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
      setResponse(result.data);

      if (response) {
        setImageId(response?.imageId);
      }

      console.log("imageId", imageId);
      if (imageId) {
        setTimeout(fetchNutritionInfo(imageId), 2000); // nutri-info function call
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Nutritioninfo api
  const fetchNutritionInfo = async (imageId) => {
    setLoading(true);
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
      console.log(error);
    }
  };

  console.log("imageId", imageId);
  // console.log("Name",nutritionInfo?.foodName[0]);
  //  console.log("calorie",nutritionInfo?.nutritional_info?.calories);
  console.log(
    "carbs",
    nutritionInfo?.nutritional_info?.totalNutrients?.CHOCDF.quantity
  );
  //  console.log("fat",nutritionInfo?.nutritional_info?.totalNutrients?.FAT.quantity);
  console.log(
    "protein",
    nutritionInfo?.nutritional_info?.totalNutrients?.PROCNT.quantity
  );

  const name = nutritionInfo?.foodName[0];
  const calories =
    Math.floor(nutritionInfo?.nutritional_info?.calories) || "N/A";
  const carbohydrates =
    Math.floor(
      nutritionInfo?.nutritional_info?.totalNutrients?.CHOCDF?.quantity
    ) || "N/A";
  const fat =
    Math.floor(
      nutritionInfo?.nutritional_info?.totalNutrients?.FAT?.quantity
    ) || "N/A";
  const protein =
    Math.floor(
      nutritionInfo?.nutritional_info?.totalNutrients?.PROCNT?.quantity
    ) || "N/A";

  return (
    <>
      {/* <Navbar /> */}
      <button
        className="close-button"
        // style={{ marginTop: "-9%", backgroundColor: "white" }}
        onClick={() => setImageModal(false)}
      >
        X
      </button>
      <div className="image-search-container">
        <h1 className="title">Image-Based Food Search</h1>
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
          Get Data
        </button>

        <div>
          <h2>Nutrition Information</h2>
          <h3>{name}</h3>
          <table
            border="1"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Calories</td>
                <td>{calories} kcal</td>
              </tr>
              <tr>
                <td>Carbohydrates</td>
                <td>{carbohydrates} g</td>
              </tr>
              <tr>
                <td>Fat</td>
                <td>{fat} g</td>
              </tr>
              <tr>
                <td>Protein</td>
                <td>{protein} g</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <label className="meal-label">Choose Meal</label>
          <select
            className="meal-select"
            name="meal-category"
            id="meal-category"
            onChange={(e) => setSelectCategory(e.target.value)}
          >
            <option value="choose">Choose here</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snack">Snack</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <div>
          <p className="calorie-info">Calorie Served: {calories}</p>
          <button className="add-meal-button" onClick={
           ()=>{
            handleSaveData
            handelImageSearchModal
           }
          }>
            Add Meal
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageSearch;
