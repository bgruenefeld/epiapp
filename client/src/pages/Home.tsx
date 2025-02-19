import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    
        <div className="bg-body-tertiary p-5 rounded">
          <p>
            Die genetische Vielfalt beim Labrador Retriever nimmt stetig ab,
          wodurch es für Züchter zunehmend schwieriger wird, gesunde, leistungsfähige und wesensfeste Hunde zu züchten. 
          Ein enger Genpool kann zu erhöhtem Krankheitsrisiko, Leistungseinbußen und instabilem Wesen führen – Herausforderungen, mit denen verantwortungsbewusste Züchter täglich konfrontiert sind.
          </p>
          <p>
            Mit BreedOptimizer bieten wir eine datengetriebene Plattform, die Züchtern hilft, nachhaltige und fundierte Zuchtentscheidungen zu treffen. 
          Basierend auf frei verfügbaren Datenquellen wie K9data.com, Saritas Blog und anderen Hundedatenbanken entwickeln wir Analysetools, 
          die den Zuchtprozess intelligenter, effizienter und transparenter gestalten.
          </p>

          <p>
            <h4>Was BreedOptimizer Züchtern bietet:</h4>
            <ul>
              <li>Genetische Diversitätsanalyse zur Vermeidung von Inzucht und genetischen Engpässen</li>
              <li>Optimierte Zuchtplanung mit datenbasierten Empfehlungen für die beste Verpaarung</li>
              <li>Detaillierte Abstammungsanalysen zur besseren Einschätzung von Gesundheits- und Leistungspotenzial</li>
              <li>Werkzeuge für eine langfristig stabile Zuchtstrategie</li>
            </ul>
            Unser Ziel ist es, Züchter mit Werkzeugen zu unterstützen, 
            damit sie die Zukunft der Labrador-Zucht aktiv und nachhaltig gestalten können.

            <h4>🔗 BreedOptimizer – Weil verantwortungsvolle Zucht Planung erfordert.</h4> 
          </p>

      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
      <div className="feature col">
        <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
        
        </div>
        <h3 className="fs-2 text-body-emphasis">🧬 Episcorer</h3>         
        <p>Analyse der Epilepsiebelastung in Ahnentafeln.</p>
        <li className="icon-link"><Link to="/episcorer" className="icon-link">Episcorer</Link></li>
      </div>
      <div className="feature col">
        <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
        </div>
        <h3>📊 COI Calculator</h3>        
        <p>Berechnung des Inzuchtkoeffizienten (COI) für die Zuchtplanung.</p>
         <li className="icon-link"><Link to="/coi-calculator" className="icon-link">Coi Calculator</Link></li>
      </div>  
    </div>
    </div>
    
  );
};

export default Home;
