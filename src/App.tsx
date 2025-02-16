
import './App.css'
import logo from "/Breedoptimizer.webp"; 
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Episcorer from "./pages/Episcorer";
import CoiCalculator from "./pages/CoiCalculator";
import Home from "./pages/Home";
function App() {
  
  return (
    <>
    <Router>
      <div className="container">
        <header className="header">
          <img src={logo} alt="BreedOptimizer Logo" className="logo" />
          <div className="title-container">
            <h1>BreedOptimizer</h1>
            <h2>Intelligente Zuchtplanung für Labrador Retriever</h2>
          </div>
        </header>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/home">Home</Link> |
          <Link to="/episcorer">Episcorer</Link> |
          <Link to="/coi-calculator">Coi Calculator</Link>
        </nav>

        {/* Seitenwechsel */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/episcorer" element={<Episcorer />} />
            <Route path="/coi-calculator" element={<CoiCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
    </>
  )
}

export default App
