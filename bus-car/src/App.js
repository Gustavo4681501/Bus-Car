import React from 'react';
import './App.css';
import AppContent from './AppContent';
import { SessionProvider } from './components/Auth/Authentication/SessionContext';
import { UserLocationProvider } from './components/Location/UserLocationContext'; // Importa el proveedor de ubicación

function App() {
  return (
    <SessionProvider>
      <UserLocationProvider>
        <AppContent />
      </UserLocationProvider>
    </SessionProvider>
  );
}

export default App;
