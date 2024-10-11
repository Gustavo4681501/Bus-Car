import React from "react";
import "./App.css";
import AppContent from "./AppContent";
import { SessionProvider } from "./components/Auth/Authentication/SessionContext";
import { UserLocationProvider } from "./components/Location/UserLocationContext"; // Importa el proveedor de ubicación
import { LoadScript } from "@react-google-maps/api";

function App() {
  const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY"; // Asegúrate de usar tu propia API key

  const libraries = ["places"];

  return (
    <SessionProvider> {/* Contexto de la session */}
      <UserLocationProvider> {/* Contexto de la ubicacion del usuario extraida del navegador */}
        <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}> {/* Cargar el script del mapa de manera asincrona */}
          <AppContent />
        </LoadScript>
      </UserLocationProvider>
    </SessionProvider>
  );
}

export default App;
