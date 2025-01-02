import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

  const navigate = useNavigate()
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <h3>Nutrition Tracker</h3>
          <p style={{ color: "white" }}>Simply #1 Health & Diet Tracking Platform</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {/* <li style={{color:"grey"}} ><a href="/home">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p style={{ color: "white" }}>439B Health Avenue</p>
          <p style={{ color: "white" }}> Varanasi ,India</p>
          <p style={{ color: "white" }}><i className="fas fa-phone-alt"></i> +91 987 373 4838</p>
          <p style={{ color: "white" }}><i className="fas fa-envelope"></i> aman.kumar@gmail.com</p>
        </div>

        {/* <div className="footer-section">
          <h4>Stay Updated</h4>
          <input
            type="email"
            className="footer-input"
            placeholder="Your email address"
          />
          <button className="footer-button" onClick={()=> navigate('/signup')}>Sign Up</button>
        </div> */}
      </div>

      <div className="footer-bottom">
        <p style={{ color: "white" }}>&copy; 2024 Nutrition Tracker | All rights reserved.</p>
        {/* <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
