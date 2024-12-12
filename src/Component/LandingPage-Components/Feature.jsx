import React from "react";
import FeatureCards from "./FeatureCards";
import "./Feature.css";
const Feature = () => {
  return (
    <div> 
       <div className="feature">
     <div id="feature-header">
        <h2 style={{ fontSize: "32px", color: "white"}}>
          Improve your nutrition with confidence.
        </h2>
        <p style={{ fontSize: "18px", color: "#a3a3a3" }}>
          {" "}
          Nutrition tracker encourages you to not just count your calories but
          to focus on your nutrition as a whole{" "}
        </p>
      </div>
      <div className="feature-component">
        <img
          id="feature-image"
          src={"https://www.foodnoms.com/_next/static/media/goals.fdef777c.png"}
          alt="feature"
        />
        <div id="feature-card">

      
          <FeatureCards
            header="Accurate nutrition data"
            description="Be confident that the food you log has the correct nutrition data. We verify every food submission for accuracy."
          />
          <FeatureCards
            header="Over many users"
            description="Join the community to get tips and inspiration from other users on our forums and Facebook "
          />
          <FeatureCards
            header="Data privacy & security"
            description="We take the security of our users' accounts seriously - we will never sell your account data to third parties."
          />
        </div>
      </div>

      </div>
    </div>
  );
};

export default Feature;
