import logo from "../assets/Breedoptimizer.webp"; // Pfad zum großen Bild anpassen
import { useNavigate } from "react-router-dom"; 

const CoiCalculator: React.FC = () => {
    const navigate = useNavigate();
    return (
      <div className="container">
         {/* Header mit Logo */}
       
        <h1>COI Calculator</h1>
        <p>Hier kommt der COI Calculator...</p>
      </div>
    );
  };
  
  export default CoiCalculator;
  