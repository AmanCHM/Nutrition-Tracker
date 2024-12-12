import React from 'react'

const FeatureCards = (props) => {

    const {header,description} = props
  return (
    <>
          <div>
            <img src="" alt="" />
        <h3 style={{color:"white", textAlign:"center"}}>  {header}</h3>
        <p> {description}</p>
        </div>
    </>
  )
}

export default FeatureCards;