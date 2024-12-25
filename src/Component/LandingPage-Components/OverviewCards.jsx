import React from 'react'
const OverviewCards = (props) => {

    const {image,header,description} = props
  return (
   <>
       <div className='cards-decription' style={{width:"500px", height:"250px"}}>
        <h3 style={{color:"grey", fontSize:"23px",textAlign:"center"}}>  {header} </h3>
        <p style={{color:"#a3a3a3",fontSize:"17px",textAlign:"center"}}> {description}</p>
            {/* <img src={image}  style={{width:"150px", height:"100px", }}alt="" /> */}
        </div>

   </>
  )
}

export default OverviewCards