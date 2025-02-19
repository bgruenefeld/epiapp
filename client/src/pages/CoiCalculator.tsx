import React, { useEffect, useState } from "react";
import { EpiDogATService} from "../serverApi/epiBackend";

// Definiere den Typ für die API-Daten
export interface Dog {
  name: string;
  link: string;
}

const CoiCalculator: React.FC = () => {
  const [serverData, setServerData] = useState<Dog[]>([]); // Hier als leeres Array initialisieren
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<string>("");

  const [dogPedigree, setPedigree] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [dogId, setDogId] = useState<string>("")

  useEffect(() => {
    const fetchEpiDogData = async () => {
     
      try {
        const epiDogATService = new EpiDogATService()
        const response = await epiDogATService.fetchData()
        if (response === undefined || !response.ok) {
          throw new Error("Fehler beim Laden der Daten");
        }
        const data = await response.json();
        // Prüfen, ob die Antwort tatsächlich ein Array ist
        if (Array.isArray(data.dogs)) {
          setServerData(data.dogs);
        } else {
          throw new Error("Ungültige API-Antwort, kein Array erhalten");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
  }

    fetchEpiDogData();
  }, []);

  // Funktion zum Laden von Hundedetails
  const fetchDogDetails = async (id: string) => {
    setDetailsLoading(true);
    setPedigree(null);
    try {
      const epiDogATService = new EpiDogATService()
      
      const response = await epiDogATService.fetchAT(id);
      if (response === undefined || !response.ok) {
        throw new Error("Fehler beim Laden der Hundedetails");
      }
      const data = await response.text();
      console.debug("response data", data )
      
      setPedigree(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDetailsLoading(false);
    }
  }
  // Event-Handler für Auswahländerung
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDogName = event.target.value;
    setSelectedDog(selectedDogName);
    if (selectedDogName) {
      let id = ""
      if(selectedDogName.split("=").length>0){
        id = selectedDogName.split("=")[1]
      }
      fetchDogDetails(id);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDogId(event.target.value);
  };
  const handleFetchById = () => {
    if (!dogId.trim()) {
      setError("Bitte geben Sie eine Hunde-ID ein");
      return;
    }
    setError(null);
    console.log("dogId", dogId)
    fetchDogDetails(dogId);
  };
  return (
    <div>
      
      {loading && <p>Lade Daten...</p>}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}

      {!loading && !error && (
        <>
        <div className="input-group">
          <label htmlFor="dog-select">Wähle einen Hund:</label>
          <select id="dog-select" value={selectedDog} onChange={handleChange} className="form-select">
                <option value="">-- Bitte wählen --</option>
                {serverData.map((dog, index) => (
                  <option key={index} value={dog.link}>
                    {dog.name}
                  </option>
                ))}
          </select>
         
          <span className="input-group-text">Hunde-ID eingeben</span>
            <input
              id="dog-id-input"
              type="text"
              value={dogId}
              onChange={handleInputChange}
              className="form-control"
            />
            <button onClick={handleFetchById}>Hund suchen</button>
          </div>
          {/* Ladeanzeige für Details */}
          {detailsLoading && <p>Ahnentafel wird geladen...</p>}

          {/* Hundedetails anzeigen */}
          {dogPedigree && (
            <div  dangerouslySetInnerHTML={{ __html: dogPedigree }} >
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoiCalculator;
