import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import "./ImageSearch.css";
import axios from "axios";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

const ImageSearch = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageData, setImageData] = useState();
  const [predictedData, setPredictedData] = useState();
  const [foodName, setFoodname] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleUpload = async () => {
    console.log("handle upload clicked");
    try {
      const isReady = await mobilenet.load();
      console.log("loaded successfully");

      const data = await isReady.classify(imageData);
      console.log("fetch-iamge-data",data);
      // console.log("image capture data", data[0].className);  
      setFoodname(data[0].className);
      setPredictedData()
      await nutrientPredictions(foodName);
    } catch (error) {
      console.log("error caught", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = imageRef.current;
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    // console.log("ImageData:", data);
    const tensor = tf.browser.fromPixels(canvas);
    setImageData(data);
  };

  const nutrientPredictions = async (foodname) => {
    try {
      const response = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          query: `${foodname}`,
        },
        {
          headers: {
            "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
            "x-app-key": import.meta.env.VITE_NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      setPredictedData(response.data);
    } catch (error) {
      console.log("error caught", error);
    }
  };
 
  console.log("predicted-data",predictedData);
  return (
    <>
      <Navbar />

      <div className="image-upload">
        <h1>Choose Image </h1>

        <input id="input-box" type="file" accept="image/*" onChange={handleFileChange} />

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <button onClick={handleUpload}>Upload</button>

        {imageSrc && (
          <img
            id="show-image"
            ref={imageRef}
            src={imageSrc}
            alt="uploaded"
            onLoad={handleImageLoad}
            style={{ width: "300px", marginTop: "20px" }}
          />
        )}
       
      </div>
      
      <div className="list-item"> 
         {/* <ul>  {predictedData} */}
      
       <li> <b>Name:</b> {predictedData?.foods[0].food_name }</li>
      <li> <b>Total Calories:</b>{predictedData?.foods[0].nf_calories }</li>
      <li> <b>Total Protein: </b>{predictedData?.foods[0].nf_protein }</li>
      <li> <b>Total fat: </b>{predictedData?.foods[0].nf_total_fat }</li>
      <li> <b>Cholesterol:</b> {predictedData?.foods[0].nf_cholesterol }</li>
      <li> <b>Sodium:</b> {predictedData?.foods[0].nf_sodium }</li>
      <li> <b>Potassium:</b> {predictedData?.foods[0].nf_potassium }</li>  

      {/* </ul> */}

      </div>

      <Footer className="footer" />
    </>
  );
};

export default ImageSearch;
