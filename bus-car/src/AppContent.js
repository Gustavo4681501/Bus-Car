import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Map from "./components/Map/Map";
import RouteList from "./components/Routes/RouteList";
import RouteMap from "./components/Routes/RouteMap";
import { SessionContext } from './components/Auth/Authentication/SessionContext'; // Importa el contexto de sesión
import { UserLocationContext } from './components/Location/UserLocationContext'; // Importa el contexto de ubicación
import User from './components/Auth/Authentication/User';
import ResetPasswordRequest from "./components/Auth/Passwords/ResetPasswordRequest";
import ResetPassword from "./components/Auth/Passwords/ResetPassword";

function AppContent() {
  const { currUser, setCurrUser } = useContext(SessionContext); // Usa el contexto de sesión
  const { userLocation } = useContext(UserLocationContext); // Usa el contexto de ubicación

  const handleSelectRoute = (route) => {
    // Navega al componente RouteMap con el ID de la ruta seleccionada
    Navigate(`/route/${route.id}`);
  };

  return (
    <>
      <div>
        <User currUser={currUser} setCurrUser={setCurrUser} />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home onSelectRoute={handleSelectRoute} />} />
          <Route path="/map" element={<Map userLocation={userLocation} />} /> {/* Usa userLocation del contexto */}
          <Route path="/routes" element={<RouteList onSelectRoute={handleSelectRoute} />} />
          <Route path="/route/:routeId" element={<RouteMap />} />
          <Route path="/ResetPassword" element={<ResetPasswordRequest />} />
          <Route path="/ResetPassword/:reset_password_token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppContent;
