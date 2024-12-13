import React, { useRef, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import "./ImageSearch.css";
import Navbar from './../Page-Components/Navbar';
import Footer from './../Page-Components/Footer';

const ImageSearch = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleUpload = async () => {
    // setPredictedData()
    try {
      const isReady = await mobilenet.load();
      const data = await isReady.classify(imageRef.current);

      if (data && data[0]?.className) {

        console.log("data",data);
        // console.log("foodname",data[0].className);
        const foodName = data[0].className;
        await nutrientPredictions(foodName);
      }
    } catch (error) {
      console.log("Error during upload:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        //  console.log(event.target.result);
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setPredictedData()
  };



  const nutrientPredictions = async (foodName) => {
    try {
      const response = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        { query: foodName },
        {
          headers: {
            "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
            "x-app-key": import.meta.env.VITE_NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      setPredictedData(response.data.foods);
    } catch (error) {
      console.log("Error fetching nutritional data:", error);
    }
  };
 console.log("predicted data",predictedData);
 console.log("imageref",imageRef);
  return (
    <>
      <Navbar/>
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
      {predictedData && (
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
              {predictedData.map((food, index) => (
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
      )}
    </div>
      <Footer/>

    </>
  );
};

export default ImageSearch;
