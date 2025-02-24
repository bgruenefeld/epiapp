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
            <p>In der Ahnentafel sind die Hunde farblich hervorgehoben, die in Stammbäumen von Hunden mit idiopathischer Epilepsie vorkommen. 
            Je größer der Zahlenwert, desto häufiger sind sie in den Ahnentafeln vertreten.</p>
            <p>Bei Click auf die Zahl hinter einem Hundenamen, werden im linken Seitenbereich Epi Nachkommen anzeigt in denen der ausgewählte Hund in der Ahnentafel vorkommt.</p>
            <p>Im Eingabefeld <b>Hunde ID</b> kann eine ID einer <b>K9data Ahnentafel</b> eingegeben werde:</p>
                <img src="./k9data-help.png" width="75%"></img>
            <p>Click auf <b>Hund suchen</b> lädt die Ahnentafel und sie wird mit den zur Verfügung stehenden Epi Scores angezeigt.</p>
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
