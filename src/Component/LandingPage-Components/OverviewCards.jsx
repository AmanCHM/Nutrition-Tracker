import React from 'react'
const OverviewCards = (props) => {

    const {image,header,description} = props
  return (
   <>
       <div className='cards-decription' style={{width:"500px", height:"250px"}}>
            {/* <img src={image}  style={{width:"70px", height:"80px"}}alt="" /> */}
        <h3 style={{color:"grey", fontSize:"25px",textAlign:"center"}}>  {header} </h3>
        <p style={{color:"black",fontSize:"20px"}}> {description}</p>
        </div>

   </>
  )
}

export default OverviewCards