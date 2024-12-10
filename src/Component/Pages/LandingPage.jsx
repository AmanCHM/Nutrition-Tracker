     import React, { useState } from 'react';
import './LandingPage.css';


import Footer from '../Page-Components/Footer';
import { NavLink } from 'react-router-dom';
import Navbar from '../Page-Components/Navbar';

const LandingPage = () => {

 

  return (
    <div>
    
     <Navbar className="navbar"/>

   
      <section  className="hero">
        <div className="content">
          <b>Welcome to Nutrition Tracker</b>
          <p>Track your meals and stay healthy!</p>
        </div>
      </section>

     <section className='signup'>
     <div>
     <h1 > Eat smarter, <br />Live better.</h1>
    
     <p>Track your calories, exercise,<br />
      biometrics and health data.</p>
 <br />
 <div>
 <button id='button' > <NavLink to={'/signup'}>SignUp</NavLink> </button>
 </div>

 </div>
 

     </section>
    

    
     <Footer/>
    </div>
  );
};

export default LandingPage;
