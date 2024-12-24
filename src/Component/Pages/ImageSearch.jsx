import React, { useEffect, useRef, useState } from "react";
import "./ImageSearch.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
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

  // const loader = useSelector((state) => state.loaderReducer.loading);

  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [imageId, setImageId] = useState(null);
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
    dispatch(showLoader())
    setImageData({
      id: Date.now(),
      name: name,
      calories: calories,
      proteins: protein,
      carbs: carbohydrates,
      fats: fat,
    });
    handelImageSearchModal();
    dispatch(hideLoader())
  };

  // ImageID API
  const handleUpload = async () => {
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
      console.log("imageId", imageId);
    } catch (error) {
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



  const name = nutritionInfo?.foodName[0];
  const calories = Math.floor(nutritionInfo?.nutritional_info?.calories);
  const carbohydrates = Math.floor(
    nutritionInfo?.nutritional_info?.totalNutrients?.CHOCDF?.quantity
  );
  const fat = Math.floor(
    nutritionInfo?.nutritional_info?.totalNutrients?.FAT?.quantity
  );
  const protein = Math.floor(
    nutritionInfo?.nutritional_info?.totalNutrients?.PROCNT?.quantity
  );


  console.log(name);
  console.log(calories);
  return (
    <>
 
    <button
      className="close-button"
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
  
 
      {nutritionInfo && (
        <div>
          <h2>Nutrition Information</h2>
          <h3>{nutritionInfo.name}</h3>
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
                <td>{nutritionInfo.calories} kcal</td>
              </tr>
              <tr>
                <td>Carbohydrates</td>
                <td>{nutritionInfo.carbohydrates} g</td>
              </tr>
              <tr>
                <td>Fat</td>
                <td>{nutritionInfo.fat} g</td>
              </tr>
              <tr>
                <td>Protein</td>
                <td>{nutritionInfo.protein} g</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

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
        <p className="calorie-info">Calorie Served: {nutritionInfo?.calories || "N/A"}</p>
        <button
          className="add-meal-button"
          onClick={handleSaveData}
        >
          Add Meal
        </button>
      </div>
    </div>
  </>
  
  );
};

export default ImageSearch;
