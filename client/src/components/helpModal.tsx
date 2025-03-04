import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const HilfetextModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      {/* Button zum Öffnen des Modals */}
      <Button variant="primary" onClick={() => setShow(true)}>
        Hilfe anzeigen
      </Button>

      {/* Das Modal */}
      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Erläuterung</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>In der Ahnentafel sind Hunde farblich markiert, die in Stammbäumen von Hunden mit idiopathischer Epilepsie vorkommen. Je höher der Zahlenwert, desto häufiger sind sie in den Ahnentafeln vertreten.</p>
            <p>Ein Klick auf die Zahl hinter einem Hundenamen zeigt im linken Seitenbereich die Nachkommen mit Epilepsie an, in deren Ahnentafel der ausgewählte Hund vorkommt.</p>
            <p>Im Eingabefeld <b>Hunde-ID</b> kann eine K9data-Ahnentafel-ID eingegeben werden. Dabei kann es sich natürlich auch um eine <b>Testverpaarung</b> handeln.</p>
            <img src="./epiapp/k9data-help.png" width="75%"></img>
            <p>Ein Klick auf <b>Hund suchen</b> lädt die entsprechende Ahnentafel und zeigt sie mit den verfügbaren Epi-Scores an.</p>                      
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

export default HilfetextModal;
