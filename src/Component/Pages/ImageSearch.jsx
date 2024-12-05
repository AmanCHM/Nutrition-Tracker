import React, { useState } from 'react'
import Navbar from '../Page-Components/Navbar';

const ImageSearch = () => {

    const [file,setFile]= useState()
     const handleInput = (e)=>{
    
        setFile(URL.createObjectURL(e.target.files[0]));
     }
     console.log("file:",file);
  return (
   <>

   {/* <div ><Navbar /></div> */}




    <h2>Add Image </h2>
   <input type="file"
     onChange={handleInput}
   />
   
   
   </>

    
  )
}

export default ImageSearch