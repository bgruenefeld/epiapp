import React, { useState } from "react";
import EpilepsyRiskCalculator from "../utils/Episcorer";
import PedigreeTree from "../components/PedigreeTree";

const Episcorer: React.FC = () => {
    const [showTree, setShowTree] = useState(false);
    const [riskScores, setRiskScores] = useState<Map<string, number>>(new Map());
  
    const pedigree = [
      ["A", "Z"],
      ["C", "D", "X", "Y"],
      ["G", "H", "M", "N", "P", "Q", "V", "W"]
    ];
    const pedigree2 = [
        ["A", "Z"],
        ["C", "D", "X", "Y"],
        ["G", "H", "M", "N", "P", "Q", "V", "W"]
      ];
      const pedigree3 = [
        ["A", "Z"],
        ["C", "D", "X", "Y"],
        ["G", "H", "M", "N", "P", "Q", "V", "W"]
      ];
    const calculateRisk = () => {
      const calculator = new EpilepsyRiskCalculator();
      calculator.addPedigree(pedigree);
      calculator.addPedigree(pedigree2);
      calculator.addPedigree(pedigree3);
      calculator.normalizeRisk();
      
      setRiskScores(calculator.evaluateNewPedigree(pedigree3));
      setShowTree(true);
    };

  return (
    
    <div className="container">
      
      <h4>Episcorer</h4>
      <button onClick={calculateRisk}>Stammbaum mit Risiko anzeigen</button>
      <div className="tree-container">
      {showTree && <PedigreeTree pedigree={pedigree3} riskScores={riskScores} />}
      </div>
    </div>
  );
};

export default Episcorer;
