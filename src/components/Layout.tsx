import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/Breedoptimizer.webp"; // Pfad zum großen Bild anpassen

const Layout: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="container">
      {/* Header mit Logo links und Text rechts übereinander */}
      <header className="header">
        <img src={logo} alt="BreedOptimizer Logo" className="logo" onClick={() => navigate("/")}/>
        <div className="header-text">
          <h1>BreedOptimizer</h1>
          <h3>Intelligente Zuchtplanung für Labrador Retriever</h3>
        </div>
      </header>

      {/* Platzhalter für den Seiteninhalt */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
