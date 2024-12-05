import React, { useState } from 'react';
import './LandingPage.css';

import Navbar from '../Page-Components/Navbar';
import Footer from '../Page-Components/Footer';

const LandingPage = () => {

 

  return (
    <div>
    
     <Navbar/>

   
      <section id="home" className="hero">
        <div className="content">
          <h1>Welcome to Nutrition Tracker</h1>
          <p>Track your meals and stay healthy!</p>
        </div>
      </section>

     <section id='signup'>
     
     <h1> <b>Eat smarter. Live better.</b></h1>
     <h3>Track your calories, exercise,
biometrics and health data.</h3>
 <button id='signup'> SignUp</button>
 <h4>Track your calories, exercise,
biometrics and health data.</h4>
     </section>
    

    
     <Footer/>
    </div>
  );
};

export default LandingPage;
