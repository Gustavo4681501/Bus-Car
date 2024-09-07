import './App.css';
import AppContent from './AppContent';
import { SessionProvider } from './components/SessionContext';
function App() {
  return (
    <SessionProvider>
      <AppContent/>
    </SessionProvider>
  );
}

export default App;
