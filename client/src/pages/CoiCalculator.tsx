import React, { useEffect, useRef, useState } from "react";
import { EpiDogATService} from "../serverApi/epiBackend";

// Definiere den Typ für die API-Daten
export interface Dog {
  name: string;
  link: string;
}
declare global {
  interface Window {
      showDetails?: (element: HTMLElement) => void;
  }
}
const CoiCalculator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [clickedText, setClickedText] = useState<string>("");

  const [serverData, setServerData] = useState<Dog[]>([]); // Hier als leeres Array initialisieren
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<string>("");

  const [dogPedigree, setPedigree] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [dogId, setDogId] = useState<string>("");

  const [dogEpiProgeny, setDogEpiProgeny] = useState<string[]| null>(null);
  const [dogName, setDogName] = useState<string>("");

  useEffect(() => {

    
    window.showDetails = async function (element: HTMLElement) {
      const dog = element.getAttribute("data-text");
      const epiDogATService = new EpiDogATService();
      if (dog) {
        const offspring = epiDogATService.fetchEpiProgeny(dog)
        setDogEpiProgeny(offspring ? offspring : []);
        setDogName(dog)
      }
    };

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
    return () => {
      // Löscht die globale Funktion bei Unmount
      window.showDetails = undefined;
    };
  }, []);

  // Funktion zum Laden von Hundedetails
  const fetchDogPedigree = async (id: string) => {
    setDetailsLoading(true);
    setPedigree(null);
    try {
      const epiDogATService = new EpiDogATService()
      
      const response = await epiDogATService.fetchAT(id);
      if (response === undefined) {
        throw new Error("Fehler beim Laden der Hundedetails");
      }
      const data = await response;
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
    setClickedText("");
    setDogEpiProgeny(null)

    if (selectedDogName) {
      let id = ""
      if(selectedDogName.split("=").length>0){
        id = selectedDogName.split("=")[1]
      }
      fetchDogPedigree(id);
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
    fetchDogPedigree(dogId);
  };
 
  function handlePedigreeClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.tagName === "A" && target.getAttribute("onclick") === "showDetails(this)") {
        const text = target.getAttribute("data-text");
        if (text) {
            setClickedText(text)
            console.log("Geklickt:", clickedText);
        }
    }
  }


  const container = containerRef.current;
  if (container) {
    container.addEventListener("click", handlePedigreeClick);
  }

  // return () => {
 
  // };
  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col" >
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary">
        <ul className="nav nav-pills flex-column mb-auto">         
          
          <li className="nav-item">
            <h4>Legende</h4>
              <ul>
                <li>P = Eltern (1)</li>
                <li>GP = Grosseltern (0,5) </li>
                <li>GGP = UrGrosseltern (0,25)</li>
                <li>...</li>
              </ul>
          </li>  
          <li className="nav-item">
            {dogEpiProgeny && (
              
              <div>
                <hr></hr>
                <h4>Nachkommen von {dogName}:</h4>
                <ul>
                  {dogEpiProgeny.map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                  ))}
              </ul>
              </div>
            )}
          </li>    
        </ul> 
      </div>
      </div>
      <div className="col-10">
      {loading && <p>Lade Daten...</p>}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}

      {!loading && !error && (
        <>
        
        <div className="input-group">
          <label htmlFor="dog-select">Hund mit Epilepsie:</label>
          <select id="dog-select" value={selectedDog} onChange={handleChange} className="form-select">
                <option value="">-- auswählen --</option>
                {serverData.map((dog, index) => (
                  <option key={index} value={dog.link}>
                    {dog.name}
                  </option>
                ))}
          </select>
          <label>ODER</label>
          <span className="input-group-text">ID eingeben</span>
            <input
              id="dog-id-input"
              type="text"
              value={dogId}
              onChange={handleInputChange}
              className="form-control"
              placeholder="k9Data ID"
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
      </div>
    </div>
  )
  //  => {
  //   delete this.window.showDetails;
  // };
};

export default CoiCalculator;
