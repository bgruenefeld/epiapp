import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation, Trans } from "react-i18next";
const HilfetextModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const { t } = useTranslation(); 
  return (
    <>
      {/* Button zum Öffnen des Modals */}
      <Button variant="primary" onClick={() => setShow(true)}>
      {t('help-modal-show-button')}
      </Button>

      {/* Das Modal */}
      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t('help-modal-header')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Trans i18nKey="help-modal-1" components={{ 1: <strong /> }}/>
            <img src="./k9data-help.png" width="75%"></img>
            <Trans i18nKey="help-modal-2" components={{ 1: <strong /> }}/>                    
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
          {t('help-modal-close-button')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HilfetextModal;
