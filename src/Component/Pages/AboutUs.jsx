import React from 'react';
import './AboutUs.css'; // Import CSS for styling
import Footer from '../Page-Components/Footer';
import Navbar from '../Page-Components/Navbar';

const AboutUs = () => {
  return (


    
    <div className="about-us">
      <Navbar/>
      <header className="about-header">
        <h1>About Us</h1>
      </header>

      <section className="about-section">
        

        <div className="about-content">
          <h2>Who We Are</h2>
          <p>
            Welcome to [Your Company Name], where we strive to provide exceptional 
            products and services to our customers. Our mission is to [state mission here].
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to [brief mission statement]. We believe in [mention core values or beliefs].
          </p>

          <h2>Our Story</h2>
          <p>
            [Your Company Name] was founded in [Year] with the goal of [goal/vision].
            Since then, we have grown into a team of dedicated professionals committed to
            delivering value to our customers every day.
          </p>

          <h2>Our Values</h2>
          <ul>
            <li><strong>Customer Focus:</strong> We prioritize customer satisfaction in every aspect of our business.</li>
            <li><strong>Innovation:</strong> We strive for creative solutions to meet evolving needs.</li>
            <li><strong>Integrity:</strong> We operate with honesty, transparency, and accountability.</li>
          </ul>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
      
      </section>

    <Footer/>
    </div>
  );
};

export default AboutUs;
