import React from "react";
import "./Overview.css";
import OverviewCards from "./OverviewCards";
const Overview = () => {
  return (
    <>
      <div className="overview">
        <span id="header">
          <h2 style={{fontSize:"2.5rem"}}>App Overview:Develop healthy habits</h2>
          <p style={{fontSize:"1.5rem" ,color:"black"}}>
            Count your calories, ensure you're meeting nutrient targets, and see
            your progress over time.
          </p>
        </span>


        <div className="overview-cards">

          <div>
            <OverviewCards image="https://raw.githubusercontent.com/harshu878/nutrimeter/b24e158e4f21902c1fe890e3fcec626ae022ebaf/client/public/Images/logMeals.svg"
              header="Track up to 82 micronutrients"
              description="Log your meals and track all your macro and micronutrients."
            />
          </div>
          <div>
            {" "}
            <OverviewCards
              header="Valuable reports and charts "
              description="Learn how nutrients and biometrics correlate over time."
            />
          </div>
          <div>
            {" "}
            <OverviewCards
              header="Log meals, exercise and biometrics"
              description="Plus, you can create custom foods, recipes, exercises and biometrics!"
            />
          </div>
          <div>
            {" "}
            <OverviewCards
              header="Track up to 82 micronutrients"
              description="Log your meals and track all your macro and micronutrients."
            />
          </div>
          <div>
            {" "}
            <OverviewCards
              header="AI enabled Image-search "
              description="Search meals via image & track all your macro and micronutrients."
            />
          </div>
          <div>
            <OverviewCards
              header="Track up to 82 micronutrients"
              description="Log your meals and track all your macro and micronutrients."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
