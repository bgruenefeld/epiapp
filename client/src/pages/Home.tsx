import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  
  const [backendStatus, setData] = useState(null);
  const { t} = useTranslation();
  useEffect(() => {
    
    const fetchBackend = async () => {
      try {
        const response = await fetch("https://epiapp-server.onrender.com/");
        const result = await response.json();
        setData(result.message);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    // Direkt ausführen
    fetchBackend();

    // Alle 1 Minuten wiederholen 
    const interval = setInterval(fetchBackend, 60000);

    // Cleanup, um Speicherlecks zu vermeiden
    return () => clearInterval(interval);
  }, []);
  return (
          <div className="d-flex align-items-center vh-80">
 
          <div className="container">
            <p><h4>{t('welcome')}</h4></p>
          <p>
           {t('home-description-p1')}
          </p>
          <p>
          {t('home-description-p2')}
          </p>
          <p>
            <h4>{t('home-description-header')}</h4>
            <ul>
              <li>{t('home-description-point1')}</li>
              <li>{t('home-description-point2')}</li>
              <li>{t('home-description-point3')}</li>
              <li>{t('home-description-point4')}</li>
            </ul>
            {t('home-description-p3')}
            <hr></hr>
            {/* <b>🔗 BreedOptimizer – Weil verantwortungsvolle Zucht Planung erfordert.</b>  */}
          </p>
          
          <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
            <div className="feature col">
              <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              
              </div>
              <h3 className="fs-2 text-body-emphasis">🧬 Episcorer</h3>         
              <p>{t('home-episcorer-desc')}</p>
              <li className="icon-link"><Link to="/coi-calculator" className="icon-link">Episcorer</Link></li>
            </div>
            <div className="feature col">
              <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              </div>
              <h3>📊 COI Calculator</h3>        
              <p>{t('home-coi-desc')}</p>
              <li className="icon-link"><Link to="/coi-calculator" className="icon-link">Coi Calculator</Link></li>
            </div> 
            <div className="feature col">
              <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              </div>
              <h3>📊 AVK Calculator</h3>        
              <p>{t('home-coi-desc')}</p>
              <li className="icon-link"><Link to="/coi-calculator" className="icon-link">AVK Calculator</Link></li>
            </div> 
          </div>
          <footer className="bg-dark text-black text-right py-3">
            Backend Status: {backendStatus}
          </footer> 
          </div>
                   
        </div>
  );
};

export default Home;
