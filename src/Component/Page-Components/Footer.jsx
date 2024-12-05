import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div><footer className="footer">
    <div className="footer-container">
      <div className="footer-section">
        <h4>About Us</h4>
        <p>
          Nutrition Tracker helps you monitor your diet and stay healthy. Track calories, manage meals, and achieve your goals.
        </p>
      </div>
     
      <div className="footer-section">
        <h4>Contact</h4>
        <p>Email: support@nutritiontracker.com</p>
        <p>Phone: +1 (123) 456-7890</p>
        <p>Location: Anywhere, Earth</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 Nutrition Tracker | All rights reserved.</p>
    </div>
  </footer>
  </div>
  )
}

export default Footer