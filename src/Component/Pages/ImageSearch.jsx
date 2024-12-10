import React, { useState } from "react";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import "./ImageSearch.css";
import axios from "axios";
import FormData from "form-data";
const ImageSearch = () => {
  const [fileUrl, setFileUrl] = useState();

  const [imageData, setImageData] = useState();

  const [blob, setBlob] = useState(null);

  const handleFile = (e) => {
    const { files } = e.target;
    console.log("files", files);
    //  const url = URL.createObjectURL(files[0]);
    const imageBlob = new Blob([files[0]], { type: files[0].type });
    setBlob(imageBlob);
  };

  const handleUpload = async () => {
    // console.log("filedata getimage", fileUrl);
     const formdata = new FormData();
    formdata.append("media", blob);
    console.log("blob", blob);

     try {
      //  const response = await fetch('https://www.caloriemama.ai/api/food_recognition_proxy', {
      //    method: 'POST',
      //    mode: 'no-cors',
      //    body: formdata,
      //  });

  const response = await axios.post(`https://platform.fatsecret.com/rest/image-recognition/v1`)

       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setImageData(responseData);

     } catch (error) {
       console.log("error caught", error);
     }
  };

  // console.log("filedata", fileUrl);
  console.log("imagedata", imageData);
  return (
    <>
      <Navbar />

      <div className="image-upload">
        <h2>Add Image </h2>
        <input type="file" onChange={handleFile} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <Footer className="footer" />
    </>
  );
};

export default ImageSearch;
