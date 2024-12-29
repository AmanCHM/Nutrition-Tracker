import React from "react";
import "./AboutUs.css"; 
import Footer from "../Page-Components/Footer";
import Navbar from "../Page-Components/Navbar";

const AboutUs = () => {
  return (
    <div className="about-us">
      <Navbar />
      <header className="about-header">
        <h1>About Nutrition Tracker</h1>
      </header>

      <section className="about-section">
        <div className="about-content">
          <h2>Who We Are</h2>
          <p>
            At Nutrition Tracker, we are passionate about empowering individuals
            to lead healthier lives through informed dietary choices. Our app is
            designed to provide personalized nutrition insights and an intuitive
            way to track your daily calorie and nutrient intake.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to revolutionize the way people approach nutrition by
            combining science, technology, and user-friendly design. We aim to
            make healthy living accessible and achievable for everyone.
          </p>

          <h2>Our Story</h2>
          <p>
            Nutrition Tracker was born from the idea that understanding what you
            eat shouldn't be complicated. With a team of health enthusiasts,
            developers, and nutrition experts, we set out to create a solution
            that simplifies meal tracking and fosters better eating habits.
          </p>

          <h2 class="values-title">Our Values</h2>
<ul class="values-list">
  <li class="value-item">🌱 Promoting Healthy Living</li>
  <li class="value-item">📊 Providing Data-Driven Insights</li>
  <li class="value-item">🤝 Building a Supportive Community</li>
  <li class="value-item">🔒 Ensuring User Privacy and Security</li>
</ul>

        </div>
      </section>

      <section className="about-team">
        <h2 style={{ color: "rgb(137, 130, 130)" }}>Meet Our Team</h2>
        <p>
          Our dedicated team of developers, nutritionists, and designers is
          committed to helping you achieve your health goals. Together, we
          innovate, inspire, and create a better way to live healthier.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
