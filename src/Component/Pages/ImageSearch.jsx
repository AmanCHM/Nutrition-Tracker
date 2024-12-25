import React, { useEffect, useRef, useState } from "react";
import "./ImageSearch.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import axios from "axios";
import GlobalSelect from "../Page-Components/Globalselect";

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
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
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



  const handleSaveData = async () => {
    dispatch(showLoader());
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
  };


  // ImageID API
  const handleUpload = async () => {
    setImageData()
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
      // console.log("imageId", imageId);
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




  
  useEffect(() => {
    if (nutritionInfo) {
      setName(nutritionInfo?.foodName[0] || "");
      setCalories(Math.floor(nutritionInfo?.nutritional_info?.calories) || 0);
      setCarbohydrates(
        Math.floor(nutritionInfo?.nutritional_info?.totalNutrients?.CHOCDF?.quantity) || 0
      );
      setFat(
        Math.floor(nutritionInfo?.nutritional_info?.totalNutrients?.FAT?.quantity) || 0
      );
      setProtein(
        Math.floor(nutritionInfo?.nutritional_info?.totalNutrients?.PROCNT?.quantity) || 0
      );
    }
  }, [nutritionInfo]); 
  

  console.log("name",name);
  console.log("calories",calories);


  const options = [
  {value:"choose" , label:"Choose here",},
     {value:"Breakfast" ,label:"Breakfast"},
    { value:"Lunch" ,label:"Lunch"},
   { value:"Snack", label:"Snack"},
    {value:"Dinner" ,label:"Dinner"}
  ]


  return (
    <>
 
    <button
      className="close-button"
      onClick={() => setImageModal(false)}
    >
      X
    </button>
  
    <div className="image-search-container">
      <h2 className="title">Upload Your Image
</h2>

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
          <div>
        <label className="meal-label">Choose Meal</label>

        <GlobalSelect>
         option = {  options }      
         
        onChange={(e) => setSelectCategory(e.target.value)}
        </GlobalSelect>
        <select
          className="meal-select"
          name="meal-category"
          id="meal-category"
          onChange={(e) => setSelectCategory(e.target.value)}
        >
        
        </select>
      </div>
  

      <div>
        <p className="calorie-info">Calorie Served: {calories || "N/A"}</p>
        <button
          className="add-meal-button"
          onClick={handleSaveData}
        >
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
