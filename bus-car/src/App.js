import React from "react";
import "./App.css";
import AppContent from "./AppContent";
import { SessionProvider } from "./components/Auth/Authentication/SessionContext";

import { LoadScript } from "@react-google-maps/api";

function App() {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Asegúrate de usar tu propia API key
  const libraries = ["places"];

  return (
    <SessionProvider> {/* Contexto de la session */}
      <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}> {/* Cargar el script del mapa de manera asincrona */}
        <AppContent />
      </LoadScript>
    </SessionProvider>
  );
}

export default App;
