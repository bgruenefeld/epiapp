import React, { useEffect, useRef, useState } from "react";
import { EpiDogATService} from "../serverApi/epiBackend";
import EpiScoreModal from "../components/EpiScoreModal"
import EpiScoreBox from "../components/EpiScoreBox";
import { Dog } from "../models/models";
import { Progeny } from "../serverApi/scoreRepo";
import { useTranslation } from "react-i18next"; 
import { useAuth } from "../context/AuthContext";
// Definiere den Typ für die API-Daten

declare global {
  interface Window {
      showDetails?: (element: HTMLElement) => void;
  }
}
const CoiCalculator: React.FC = () => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [clickedText, setClickedText] = useState<string>("");

  const [serverData, setServerData] = useState<Dog[]>([]); // Hier als leeres Array initialisieren
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<string>("");

  const [dogPedigree, setPedigree] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [dogId, setDogId] = useState<string>("");

  const [dogEpiProgeny, setDogEpiProgeny] = useState<Progeny| undefined>(undefined);
  const [dogName, setDogName] = useState<string>("");
  const [dog,setDog] = useState<Dog|null>()
  const [vertical,setVertical] = useState(false);
  const [hoveredAncestors, setHoveredAncestors] = useState<Set<string>>(new Set());


  const { t } = useTranslation(); 

  // const [shouldShow, setShouldShow] = useState(false);

  // useEffect(() => {
  //   console.log("useEffect triggered, user:", user);
  //   setShouldShow(!!user);
  // }, [user]);

  useEffect(() => {
    // Fetch-Daten abrufen
    const fetchEpiDogData = async () => {
      try {
        const epiDogATService = new EpiDogATService();
        const response = await epiDogATService.fetchData();
        if (response === undefined || !response.ok) {
          throw new Error("Fehler beim Laden der Daten");
        }
        const data = await response.json();
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
    };
  
    fetchEpiDogData();
  
    return () => {
      window.showDetails = undefined; // Entfernt globale Funktion sauber
    };
  }, []); // Nur einmal ausführen beim Mounting
  
  // Separater useEffect für das Highlighting
  useEffect(() => {
    const pedigreeContainer = document.getElementById("pedigree-container");
    if (!pedigreeContainer) return;
  
    const elements = pedigreeContainer.querySelectorAll(".ancestor");
  
    elements.forEach((element) => {
      const ancestorName = element.getAttribute("data-ancestor");
      if (ancestorName && hoveredAncestors.has(ancestorName)) {
        (element as HTMLElement).style.border= "2px solid #92ea0b";
        (element as HTMLElement).style.backgroundColor = "#6c757d";
        
      } else {
        (element as HTMLElement).style.backgroundColor = "transparent";
        (element as HTMLElement).style.border= "transparent";
      }
    });
  
  }, [hoveredAncestors]); // Aktualisiert sich nur, wenn `hoveredAncestors` geändert wird
  
  // Separater useEffect für `window.showDetails`
  useEffect(() => {
    window.showDetails = async function (element: HTMLElement) {
      const dog = element.getAttribute("data-text");
      const epiDogATService = new EpiDogATService();
      if (dog) {
        const offspring = epiDogATService.fetchEpiProgeny(dog);
        setDogEpiProgeny(offspring);
        setDogName(dog);
      }
    };
  
    return () => {
      window.showDetails = undefined; // Entfernt die Funktion beim Unmount sauber
    };
  }, []);
  const handelAVKDog = (dog:string) =>{
    const epiDogATService = new EpiDogATService();
    if (dog) {
      const offspring = epiDogATService.fetchEpiProgeny(dog);
      setDogEpiProgeny(offspring);
      setDogName(dog);
    }else{
      setDogEpiProgeny(undefined);
      setDogName("");
    }
  }
  const handleMouseEnter = (name: string) => {
    setHoveredAncestors((prev) => new Set(prev).add(name));
  };
  
  const handleMouseLeave = (name: string) => {
    setHoveredAncestors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(name);
      return newSet;
    });
  };
  // Funktion zum Laden von Hundedetails
  const fetchDogPedigree = async (id: string, vertical:boolean) => {
    setDetailsLoading(true);
    setPedigree(null);
    setDog(null);

    try {
      const epiDogATService = new EpiDogATService()
      
      const response = await epiDogATService.fetchAT(id,vertical);
      if (response === undefined) {
        throw new Error("Fehler beim Laden der Hundedetails");
      }
      const data = await response;
      setPedigree(data.pedigree);
      setDog(data.dog)
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
    setDogEpiProgeny(undefined)

    if (selectedDogName) {
      let id = ""
      if(selectedDogName.split("=").length>0){
        id = selectedDogName.split("=")[1]
      }
      setDogId(id)
      fetchDogPedigree(id,vertical);
    }
  };
   
  const handleVertical =  (event: React.ChangeEvent<HTMLInputElement>) => {
    
    console.log("handle vertical:", event.target.checked);
    setVertical(event.target.checked);
    fetchDogPedigree(dogId,event.target.checked);
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
    

    fetchDogPedigree(dogId,vertical);
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

  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col" >
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary">
        <ul className="nav nav-pills flex-column mb-auto">         
          
          <li className="nav-item">
          {dog && (
            <div>
              <h4> {t('epi-scorer-genetic')}:</h4>
              <p>( {t('epi-scorer-5-gen')})</p>
              <div className="row g-3 align-items-center">
                  <div className="col-auto">
                    <label className="col-form-label">COI:</label>
                  </div>
                  <div className="col-auto">
                    {dog.coi} %
                  </div>
              </div>
              <div className="row g-3 align-items-center">
                  <div className="col-auto">
                    <label className="col-form-label">AVK:</label>
                  </div>
                  <div className="col-auto">
                    {dog.avk?.avk} % 
                  </div>
              </div>
              
              <hr></hr>
              <div><b>{t('epi-scorer-avk-anchestors')}:</b></div>
              {dog.avk?.lostAncestors.map(lost => (   
                <button type="button" 
                className="btn btn-sm btn-outline-secondary position-relative"
                key={lost.name}
                onMouseEnter={() => {handleMouseEnter(lost.name)}}
                onMouseLeave={() => {handleMouseLeave(lost.name)}}
                onClick={() => handelAVKDog(lost.name)}
                style={{ cursor: "pointer", margin: "2px", color: "white" }}>
                   {lost.name}
                <span className=" position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
                 style={{zIndex: "1000"}}
                >
                  {lost.count}
                <span className="visually-hidden">unread messages</span>
               </span>
              </button>
              
               ), )}</div>
                      
          )}
          </li>  
          <li className="nav-item">
            {dogEpiProgeny && (
              
              <div>
                <hr></hr>
                <h4 className="blur-text">{t('epi-scorer-epi-progeny')} {dogName}:</h4>
                {dogEpiProgeny.P&&(
                  <div>
                  <label>P:</label>
                  <ul>
                    {dogEpiProgeny.P.map((item, index) => (
                      <li className="blur-text" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                )}   
                {dogEpiProgeny.GP&&(
                  <div>
                  <label>GP:</label>
                  <ul>
                    {dogEpiProgeny.GP.map((item, index) => (
                      <li className="blur-text" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                )}
                {dogEpiProgeny.GGP&&(
                  <div>
                  <label>GGP:</label>
                  <ul>
                    {dogEpiProgeny.GGP.map((item, index) => (
                      <li className="blur-text" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                )}
                {dogEpiProgeny.GGGP&&(
                  <div>
                  <label>GGGP:</label>
                  <ul>
                    {dogEpiProgeny.GGGP.map((item, index) => (
                      <li className="blur-text" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                )}
                 {dogEpiProgeny.GGGGP&&(
                  <div>
                  <label>GGGGP:</label>
                  <ul>
                    {dogEpiProgeny.GGGGP.map((item, index) => (
                      <li className="blur-text" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                )}                           
              </div>
            )}
          </li>    
        </ul> 
      </div>
      </div>
      <div id="pedigree-container" className="col-10">
      {loading && <p>{t('epi-scorer-loading')}</p>}
      {error && <p style={{ color: "red" }}>{t('epi-scorer-loading-error')}: {error}</p>}

      {!loading && !error && (
        <>
        <div className="row row-cols-lg-auto g-3 align-items-center">
          <div className="col-12">                      
              <input
                id="dog-id-input"
                type="text"
                value={dogId}                
                onChange={handleInputChange}
                className="form-control"
                placeholder="k9Data ID"
              />            
          </div>

          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="inlineFormCheck" onChange={handleVertical} checked={vertical}></input>
              <label className="form-check-label" htmlFor="inlineFormCheck">
              {t('epi-scorer-vertical-pedigree')} 
              </label>
            </div>
          </div>

          <div className="col-12">          
            <button onClick={handleFetchById} className="btn btn-primary">{t('epi-scorer-show-pedigree')}</button>
          </div>
           
          <div className="col-12">        
            <select id="dog-select" value={selectedDog} onChange={handleChange} className="form-select">
                  <option value="">-- {t('epi-scorer-epileptic-dogs')} --</option>
                  {serverData.map((dog, index) => (
                    <option key={index} value={dog.link}>
                      {dog.name}
                    </option>
                  ))}
            </select>
          </div>
          
          
          
          <div className="col-12">
          <EpiScoreModal />          
          </div>
          <div className="col-12 ms-auto">          
          <EpiScoreBox/> 
          </div>

        </div>
          
          {/* Ladeanzeige für Details */}
          {detailsLoading && <div className="d-flex justify-content-center">
                               <div className="spinner-border" role="status">
                                 <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>}
          {/* Hundedetails anzeigen */}         
           
          {dogPedigree && (
            <div dangerouslySetInnerHTML={{ __html: dogPedigree }} ></div>
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
