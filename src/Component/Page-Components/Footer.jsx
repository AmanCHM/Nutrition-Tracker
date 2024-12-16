import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div><footer className="footer">
    <div className="footer-container">
      <div className="footer-section">
        <h4>About Us</h4>
        <p style={{color:"white"}}>
          Nutrition Tracker helps you monitor your diet and stay healthy. Track calories, manage meals, and achieve your goals.
        </p>
      </div>
     
      <div className="footer-section" >
        <h4>Contact</h4>
        <p style={{color:"white"}}>Email: aman.kumar@gmail.com</p>
        <p style={{color:"white"}}>Phone: +91 987 373 4838</p>
        <p style={{color:"white"}}>Location: Varanasi, India</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p style={{color:"white"}}>&copy; 2024 Nutrition Tracker | All rights reserved.</p>
    </div>
  </footer>
  </div>
  )
}

export default Footer