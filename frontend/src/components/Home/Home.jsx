import React, { useContext } from "react";
import Navbar from "../Navbar/Navbar";
import assets from "../../assets/assets";
import { AppContent } from "../../context/AppContext.jsx";
const Home = () => {
  const { userData } = useContext(AppContent);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-page-content">
        <img src={assets.header_img} className="robo-img" alt="robo image" />
        <h2>Hey {userData ? userData.name : "Developer!"}👋</h2>
        <h1>Welcome to our app</h1>
        <p className="home-text">
          Let's start with a quick product tour ans we will have you up and
          running in no time!
        </p>
        <button className="home-start-btn">Get Started</button>
      </div>
    </div>
  );
};

export default Home;
