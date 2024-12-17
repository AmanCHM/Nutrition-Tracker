import React, { useRef, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./ImageSearch.css";
import Navbar from './../Page-Components/Navbar';
import Footer from './../Page-Components/Footer';
import Loader from './../Page-Components/Loader';
import { useAddMealMutation } from "../../Redux/foodApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import '@tensorflow/tfjs-backend-webgl';

const ImageSearch = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [loading,setLoading] =useState(false)


 const loader = useSelector((state)=> state.loaderReducer.loading)
 console.log("laoder",loader);

 const dispatch = useDispatch()

 const handleUpload = async () => {
  try {
    dispatch(showLoader())
    const isReady = await mobilenet.load();
    const data = await isReady.classify(imageRef.current);

    if (data && data[0]?.className) {

      console.log("data",data);
      const foodName = data[0].className;
    await  nutrientPredictions(foodName);
    }
  } catch (error) {
    console.log("Error during upload:", error);
  }finally{
    dispatch(hideLoader())
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

  const [addMeal, { data:predict }] = useAddMealMutation();
 console.log("predictedData",predict);

  const nutrientPredictions = async (foodName)=>{
    if (foodName) {
     await  addMeal(foodName);
    }
  }

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
      {loader? <Loader/>:(predict?.foods && (
        <div className="results-section">
          <h2 className="results-title">Nutritional Information</h2>
          <table className="results-table" >
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
      ))}
    </div>
      <Footer/>

    </>
  );
};

export default ImageSearch;
