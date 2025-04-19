// src/App.js

import React from 'react';
import './App.css'; // Import the CSS file with the correct file name
import '@fortawesome/fontawesome-free/css/all.min.css';
import Chat from './Chat.js'; // Import the Chat component (correct file name)

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Chat />
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="app-header">
        <div className="header-options">
        <button className="header-btn"><img src={require("./back.png")} alt="Back" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '33px', height: '26px' }}/></button>
        <button className="header-btn"><img src={require("./profile.png")} alt="Profile" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '70px', height: '26px' }}/></button>
        </div>
      <div className="logo"><img src={require("./logo.jpg")} alt="VI$TOR" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '200px', height: '40px' }}/></div>
      <div className="header-options">
        <button className="header-btn"><img src={require("./home.png")} alt="Home" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '33px', height: '26px' }}/></button>
        <button className="header-btn"><img src={require("./setting.png")} alt="Setting" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '33px', height: '26px' }}/></button>     
    </div>
    </header>
  );
};

export default App;



