import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Map from "./components/Map/Map";
import RouteList from "./components/Routes/GetRoute/RouteList/RouteList";
import { SessionContext } from './components/Auth/Authentication/SessionContext'; // Importa el contexto de sesión
import User from './components/Auth/Authentication/User';
import ResetPasswordRequest from "./components/Auth/Passwords/ResetPasswordRequest";
import ResetPassword from "./components/Auth/Passwords/ResetPassword";
import EditRoute from './components/Routes/EditRoute/EditRoute';
import GetRoute from './components/Routes/GetRoute/GetRoute';
import CreateRoute from './components/Routes/CreateRoute/CreateRoute';


function AppContent() {
  const { currUser, setCurrUser } = useContext(SessionContext); // Usa el contexto de sesión
  
  return (
    <>
    <div>
        {currUser ? currUser.sub : null}
      </div>
      {/* <div>
        <User currUser={currUser} setCurrUser={setCurrUser} />
      </div> */}
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<User/>} />
          <Route path="/map" element={<Map />} /> {/* Usa userLocation del contexto */}
          <Route path="/create-route" element={<CreateRoute/>} />
          <Route path="/routes" element={<RouteList/>} />
          <Route path="/route/:routeId" element={<GetRoute />} />
          <Route path="/edit-route/:routeId" element={<EditRoute/>} />
          <Route path="/ResetPassword" element={<ResetPasswordRequest />} />
          <Route path="/ResetPassword/:reset_password_token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppContent;
