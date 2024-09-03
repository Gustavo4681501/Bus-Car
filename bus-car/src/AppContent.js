import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home/Home"
import Map from "./components/Map/Map"

function AppContent() {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Map" element={<Map/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default AppContent
