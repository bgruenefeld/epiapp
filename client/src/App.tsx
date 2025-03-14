
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import logo from "/Breedoptimizer.webp"; 
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
// import Episcorer from "./pages/Episcorer";
import CoiCalculator from "./pages/CoiCalculator";
import Home from "./pages/Home";
import HilfetextModal from './components/helpModal';
import LanguageSelector from "./components/LanguageSelector"
// import Login from './components/Login';
import { AuthProvider } from "./context/AuthContext";

function App() {
  //const { t, i18n} = useTranslation();
  // Funktion zum Wechseln der Sprache

  return (
    <>
     <AuthProvider>
    <Router basename="/epiapp">
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div className="container-fluid">
      <img src={logo} alt="BreedOptimizer Logo" className="bi me-2" width="40" height="32" />
        <a className="navbar-brand" href="./home">BreedOptimizer</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item nav-link"><Link to="./home" className="nav-item nav-link">Home</Link></li>
            {/* <li className="nav-item nav-link"><Link to="./episcorer" className="nav-item nav-link">Coi Calculator</Link></li> */}
            <li className="nav-item nav-link"><Link to="./coi-calculator" className="nav-item nav-link">Episcorer</Link></li>   
          </ul>
          <div className="d-flex align-items-center ms-auto">
            {/* <Login/> */}
            <LanguageSelector/>
            <HilfetextModal />        
          </div>
        </div>
      </div>
    </nav>
        {/* Seitenwechsel */}
        <main className="container-fluid" style={{ paddingTop: "80px" }}>
       
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/episcorer" element={<Episcorer />} /> */}
            <Route path="/coi-calculator" element={<CoiCalculator />} />
          </Routes>
         
        </main>
      
    </Router>
    </AuthProvider> 
    </>
  )
}

export default App
