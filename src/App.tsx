
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
    {/* <Router>
    <div className="container">
    <header className="header">
        <img src={logo} alt="BreedOptimizer Logo" className="logo" />
        <div className="title-container">
          <h1>BreedOptimizer</h1>
          <h2>Intelligente Zuchtplanung für Labrador Retriever</h2>
        </div>
      </header>
      
      
      <div className="app-grid">
        <Link to="/episcorer">
        <div className="app-card" >
          <h3>🧬 Episcorer</h3>         
            <p>Analyse der Epilepsiebelastung in Ahnentafeln.</p>
        </div>
        </Link>
        <Link to="/coi-calculator">
        <div className="app-card" >
          <h3>📊 COI Calculator</h3>        
            <p>Berechnung des Inzuchtkoeffizienten (COI) für Zuchtplanung.</p>
          </div>        
      </Link>
      </div>
        <main className="content">
          <Routes>
            <Route path="/" element={<h2>Willkommen zur BreedOptimizer App!</h2>} />
            <Route path="/episcorer" element={<Episcorer />} />
            <Route path="/coi-calculator" element={<CoiCalculator />} />
          </Routes>
        </main>
      </div>
      </Router> */}
    </>
  )
}

export default App
