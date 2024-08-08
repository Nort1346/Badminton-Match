import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

function WinnerModal({ isShow, onClose, info }) {
  const [show, setShow] = useState(isShow);

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
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
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title className="fs-2 fw-bolder">{`${info?.name} Wins!`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="fs-2 fw-bolder text-center">
        {info.score}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WinnerModal;

