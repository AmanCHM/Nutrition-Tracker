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

const ImageSearch = ({ setImageModal }) => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

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
      setTimeout(fetchNutritionInfo(),2000)
      // await fetchNutritionInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNutritionInfo = async () => {
    setLoading(true);
    const data = JSON.stringify({ "imageId": imageId });
    try {
      const result = await axios.post(
        `https://api.logmeal.com/v2/nutrition/recipe/nutritionalInfo`,
        {
          headers: {
            Authorization: import.meta.env.VITE_LOGMEAL_API_TOKEN,
            "Content-Type": "application/json",
          },
          data: data,
        }
      );
      setNutritionInfo(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("calories",nutritionInfo?.nutritional_info?.calories);
  // console.log("nutrittioninfo",nutritionInfo?.nutritional_info?.totalNutrients);
  console.log("response", response?.imageId);
  console.log(response)
  // console.log("nutrition info", nutritionInfo);
  return (
    <>
      <Navbar />
      <button
        className="close-button"
        style={{ marginTop: "-9%", backgroundColor: "white" }}
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
        {/* {loader ? (
          <Loader />
        ) : (
          predict?.foods && (
            <div className="results-section">
              <h2 className="results-title">Nutritional Information</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Food Name</th>
                    <th>Calories</th>
                    <th>Protein (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fat (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {predict?.foods.map((food, index) => (
                    <tr key={index}>
                      <td>{food.food_name}</td>
                      <td>{food.nf_calories}</td>
                      <td>{food.nf_protein}</td>
                      <td>{food.nf_total_carbohydrate}</td>
                      <td>{food.nf_total_fat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )} */}
      </div>
      <Footer />
    </>
  );
};

export default ImageSearch;