
import './App.css'
import logo from "/Breedoptimizer.webp"; 
function App() {
  
  return (
    <>
    
    <div className="container">
    <header className="header">
        <img src={logo} alt="BreedOptimizer Logo" className="logo" />
        <div className="title-container">
          <h1>BreedOptimizer</h1>
          <h2>Intelligente Zuchtplanung für Labrador Retriever</h2>
        </div>
      </header>
      {/* Einleitungstext */}
      <div className="text-container">
        Die genetische Vielfalt beim Labrador Retriever nimmt stetig ab,
        wodurch es für Züchter zunehmend schwieriger wird, gesunde, leistungsfähige und wesensfeste Hunde zu züchten. 
        Ein enger Genpool kann zu erhöhtem Krankheitsrisiko, 
        Leistungseinbußen und instabilem Wesen führen – Herausforderungen, mit denen verantwortungsbewusste Züchter täglich konfrontiert sind.
        Mit BreedOptimizer bieten wir eine datengetriebene Plattform, die Züchtern hilft, nachhaltige und fundierte Zuchtentscheidungen zu treffen. 
        Basierend auf frei verfügbaren Datenquellen wie K9data.com, Saritas Blog und der DRC-Datenbank entwickeln wir Analysetools, 
        die den Zuchtprozess intelligenter, effizienter und transparenter gestalten.
      </div>

      {/* Vorteile */}
      <div className="text-container">
        <h3>Was BreedOptimizer Züchtern bietet:</h3>
        <ul>
          <li>Genetische Diversitätsanalyse zur Vermeidung von Inzucht und genetischen Engpässen</li>
          <li>Optimierte Zuchtplanung mit datenbasierten Empfehlungen für die beste Verpaarung</li>
          <li>Detaillierte Abstammungsanalysen zur besseren Einschätzung von Gesundheits- und Leistungspotenzial</li>
          <li>Werkzeuge für eine langfristig stabile Zuchtstrategie</li>
        </ul>
        Unser Ziel ist es, Züchter mit modernen Methoden zu unterstützen, 
        damit sie die Zukunft der Labrador-Zucht aktiv und nachhaltig gestalten können.

        <h3>🔗 BreedOptimizer – Weil verantwortungsvolle Zucht Planung erfordert.</h3> 
      </div>
      <div className="app-grid">
        <div className="app-card" >
          <h3>🧬 Episcorer</h3>
          <p>Analyse der Epilepsiebelastung in Ahnentafeln.</p>
        </div>
        <div className="app-card" >
          <h3>📊 COI Calculator</h3>
          <p>Berechnung des Inzuchtkoeffizienten (COI) für Zuchtplanung.</p>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
