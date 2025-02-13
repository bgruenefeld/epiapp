import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Episcorer from "./pages/Episcorer";
import CoiCalculator from "./pages/CoiCalculator";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <Router basename="epiapp">
      <Routes>
        <Route  element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/episcorer" element={<Episcorer />} />
        <Route path="/coi-calculator" element={<CoiCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;







// import { useState } from "react";
// import "./App.css";
// import logo from "./assets/Breedoptimizer.webp"; // Pfad zum großen Bild anpassen

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="container">
//       {/* Header mit Logo */}
//       <div className="header">
//         <img src={logo} alt="BreedOptimizer Logo" className="logo" />
//         <div>
//           <h1>BreedOptimizer</h1>
//           <h3>Intelligente Zuchtplanung für Labrador Retriever</h3>
//         </div>
//       </div>

//       {/* Einleitungstext */}
//       <div className="text-container">
//         Die genetische Vielfalt beim Labrador Retriever nimmt stetig ab,
//         wodurch es für Züchter zunehmend schwieriger wird, gesunde, leistungsfähige und wesensfeste Hunde zu züchten. 
//         Ein enger Genpool kann zu erhöhtem Krankheitsrisiko, 
//         Leistungseinbußen und instabilem Wesen führen – Herausforderungen, mit denen verantwortungsbewusste Züchter täglich konfrontiert sind.
//         Mit BreedOptimizer bieten wir eine datengetriebene Plattform, die Züchtern hilft, nachhaltige und fundierte Zuchtentscheidungen zu treffen. 
//         Basierend auf frei verfügbaren Datenquellen wie K9data.com, Saritas Blog und der DRC-Datenbank entwickeln wir Analysetools, 
//         die den Zuchtprozess intelligenter, effizienter und transparenter gestalten.
//       </div>

//       {/* Vorteile */}
//       <div className="text-container">
//         <h3>Was BreedOptimizer Züchtern bietet:</h3>
//         <ul>
//           <li>Genetische Diversitätsanalyse zur Vermeidung von Inzucht und genetischen Engpässen</li>
//           <li>Optimierte Zuchtplanung mit datenbasierten Empfehlungen für die beste Verpaarung</li>
//           <li>Detaillierte Abstammungsanalysen zur besseren Einschätzung von Gesundheits- und Leistungspotenzial</li>
//           <li>Werkzeuge für eine langfristig stabile Zuchtstrategie</li>
//         </ul>
//         Unser Ziel ist es, Züchter mit modernen Methoden zu unterstützen, 
//         damit sie die Zukunft der Labrador-Zucht aktiv und nachhaltig gestalten können.

//         <h3>🔗 BreedOptimizer – Weil verantwortungsvolle Zucht Planung erfordert.</h3> 
//       </div>

//       {/* Button zum Testen */}
//       <button onClick={() => setCount((count) => count + 1)}>
//         count is {count}
//       </button>
//     </div>
//   );
// }

// export default App;
