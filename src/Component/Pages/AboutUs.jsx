import React from "react";
import "./AboutUs.css"; // Import CSS for styling
import Footer from "../Page-Components/Footer";
import Navbar from "../Page-Components/Navbar";

const AboutUs = () => {
  return (
    <div className="about-us">
      <Navbar />
      <header className="about-header">
        <h1>About Us</h1>
      </header>

      <section className="about-section">
        <div className="about-content">
          <h2>Who We Are</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ad
            mollitia magnam quo fugit, debitis dignissimos voluptatem dolore qui
            quidem optio. Sint iste obcaecati blanditiis. Illum quos similique
            ducimus ut!
          </p>

          <h2>Our Mission</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            cum officia atque architecto? Error, ex obcaecati blanditiis minus
            et laudantium!
          </p>

          <h2>Our Story</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
            odio odit vero sunt esse nam obcaecati beatae harum vitae
            dignissimos magnam laboriosam id delectus iure quos rem perferendis
            libero minus, veniam ex nulla aliquid hic. Voluptatibus repudiandae
            architecto impedit ut quaerat, quod qui assumenda amet libero atque?
            Molestiae, sed dicta?
          </p>

          <h2>Our Values</h2>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
