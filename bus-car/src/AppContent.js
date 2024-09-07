import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Map from "./components/Map/Map";
import { useState, useEffect } from "react";
import './App.css';
import User from './components/User';
import { jwtDecode } from "jwt-decode";
import ResetPasswordRequest from "./components/ResetPasswordRequest";
import ResetPassword from "./components/ResetPassword";
import RouteList from "./components/Map/LocationsList.jsx";

function AppContent() {
  const [currUser, setCurrUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrUser(decodedToken);
      } catch (error) {
        console.log("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
      console.log(userLocation)
    }
  }, []); 

  return (
    <>
      <div>
        <User currUser={currUser} setCurrUser={setCurrUser} />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map userLocation={userLocation} />} />
          <Route path="/routes" element={<RouteList />} />
          <Route path="/ResetPassword" element={<ResetPasswordRequest />} />
          <Route path="/ResetPassword/:reset_password_token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppContent;
