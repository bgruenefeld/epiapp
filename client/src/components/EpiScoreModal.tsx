import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { MathJax, MathJaxContext } from "better-react-mathjax";

const EpiScoreModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      {/* Button zum Öffnen des Modals */}
      <Button variant="secondary" onClick={() => setShow(true)}>
        Definition EpiScore
      </Button>

      {/* Das Modal */}
      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Erläuterung</Modal.Title>
        </Modal.Header>
        <Modal.Body>            
            <MathJaxContext>
            <div style={{ maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
                <h3>Algorithmus zur Berechnung der Epilepsie-Belastung bei Hunden</h3>
                <p>
                Um die genetische Belastung eines Hundes hinsichtlich Epilepsie zu bestimmen, wird ein Algorithmus angewendet, 
                der auf den Ahnentafeln von Epilepsie-Hunden basiert. Dabei wird zunächst für jeden Hund erfasst, 
                in wie vielen Stammbäumen er vorkommt und in welcher Generation er zu einem betroffenen Hund steht. 
                Je näher der Hund an einem Epilepsie-Fall ist, desto höher ist sein Einfluss.
                </p>

                <h3>1️⃣ Berechnung der Epilepsie-Belastung</h3>
                <p>
                Zur Quantifizierung dieses Einflusses wird jedem Vorfahren eines Epilepsie-Hundes ein 
                <b>Generationsgewicht</b> zugewiesen, das sich exponentiell verringert:
                </p>
                <ul>
                <li>Eltern erhalten den Wert <b>2</b></li>
                <li>Großeltern erhalten den Wert <b>0.75</b></li>
                <li>Urgroßeltern erhalten den Wert <b>0.25</b></li>
                <li>usw. (je weiter entfernt, desto niedriger)</li>
                </ul>

                <h3>2️⃣ Normalisierung nach Anzahl der Stammbäume</h3>
                <p>
                Da einige Hunde besonders häufig in Stammbäumen vertreten sind, unabhängig davon, 
                ob sie eine starke Verbindung zur Epilepsie haben, wird der berechnete Wert durch die 
                <b>Gesamtanzahl der Ahnentafeln von Epilepsie-Hunden</b> geteilt. Die berechnete Epilepsie-Belastung eines Hundes ergibt sich somit als:
                </p>
                <MathJax>{"\\[ E^*(h) = \\frac{\\sum g(h, s)}{|S|} \\]"}</MathJax>
                <p>
                wobei <MathJax>{"\\( g(h, s) = 2^{-d(h, s)} \\)"}</MathJax> das Generationsgewicht für einen Hund <MathJax>{"\\( h \\)"}</MathJax> in einem Stammbaum \( s \) ist 
                und <MathJax>{"\\( |S| \\)"}</MathJax> die Anzahl aller Epilepsie-Stammbäume.
                </p>

                <h3>3️⃣ Min-Max-Normalisierung auf eine Skala von 0 bis 1</h3>
                <p>
                Um Werte vergleichbar zu machen, werden sie in einen Bereich zwischen 0 und 1 transformiert. 
                Dazu werden zunächst die minimalen und maximalen Werte bestimmt:
                </p>
                <MathJax>{"\\[ E_{\\min} = \\min_{h \\in H} E^*(h), \\quad E_{\\max} = \\max_{h \\in H} E^*(h) \\]"}</MathJax>
                <p>
                und anschließend für jeden Hund der normalisierte Wert berechnet:
                </p>
                <MathJax>{"\\[ E_{\\text{norm}}(h) = \\frac{E^*(h) - E_{\\min}}{E_{\\max} - E_{\\min}} \\]"}</MathJax>

                <h3>🔹 Ergebnis</h3>
                <p>
                Am Ende dieses Prozesses erhält jeder Hund einen <b>Epilepsie-Wert zwischen 0 und 1</b>, wobei:
                </p>
                <ul>
                <li><b>0</b> bedeutet, dass der Hund nur schwach oder gar nicht mit Epilepsie-Fällen verbunden ist.</li>
                <li><b>1</b> bedeutet, dass der Hund eine starke genetische Nähe zu Epilepsie-Fällen aufweist.</li>
                </ul>

                <h3>🔹 Vorteile dieses Ansatzes</h3>
                <ul>
                <li>✔ Berücksichtigt die genetische Nähe zu Epilepsie-Hunden (durch Generationsgewicht).</li>
                <li>✔ Normalisiert nach Anzahl der Stammbäume, um Verzerrungen durch populäre Hunde zu vermeiden.</li>
                <li>✔ Transformiert auf eine Skala von 0 bis 1 für eine einheitliche Vergleichbarkeit.</li>
                <li>✔ Robust gegenüber ungleicher Datenverteilung.</li>
                </ul>

                <p>
                Diese Berechnungsmethode ermöglicht eine <b>präzise und vergleichbare Bewertung der Epilepsie-Belastung einzelner Hunde</b>, 
                indem sie sowohl die direkte genetische Nähe als auch die Häufigkeit der Vererbung berücksichtigt.
                </p>
            </div>
            </MathJaxContext>
            
           
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Schließen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EpiScoreModal;
