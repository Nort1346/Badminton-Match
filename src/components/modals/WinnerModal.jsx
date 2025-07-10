import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function WinnerModal({ isShow, onClose, info }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(isShow);

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  const handleCloseReset = () => {
    setShow(false);
    if (onClose) onClose(true);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered={true}
      size="xl"
      className={`bg-${info.variant}`}
    >
      <Modal.Header className="d-flex justify-content-center border-0">
        <Modal.Title className="fs-2 fw-bolder text-center">
          {t("winnerModal.title", { playerName: info?.name })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="fs-2 fw-bolder text-center">
        {info.score}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={handleClose}>
          {t("winnerModal.close")}
        </Button>
        <Button variant={info.variant} onClick={handleCloseReset}>
          {t("winnerModal.confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WinnerModal;
