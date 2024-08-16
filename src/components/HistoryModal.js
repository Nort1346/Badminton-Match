import { useEffect, useState } from "react";
import { Modal, Button, ListGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import getVariantColor from "./functions/getVariantColor";

function HistoryModal({ isShow, onClose }) {
    const { t } = useTranslation();
    const [show, setShow] = useState(isShow);
    const history = JSON.parse(localStorage.getItem("HISTORY")) ?? [];

    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    const handleClose = (changes) => {
        setShow(false);
        if (onClose) onClose(changes ?? false);
    };

    const getName = (player) => {
        return player.name || t(`players.${player.color.toLowerCase()}Player`);
    }

    const getVariant = (match) => {
        const winner = match[0].sets > match[1].sets ? match[0] : match[1];
        return getVariantColor(winner.color);
    }

    return (
        <Modal
            scrollable={true}
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered={true}
            size="lg"
        >
            <Modal.Header className="d-flex justify-content-center border-0">
                <Modal.Title className="fs-4 fw-bolder text-center">
                    {t("historyModal.history")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="fw-semibold text-left">
                <ListGroup>
                    {history.map((match, index) => (
                        <ListGroup.Item key={`history-${index}`} className={`d-flex flex-column align-items-center bg-${getVariant(match)} overflow-y-hidden`}>
                            <Row md={12} className="text-truncate">
                                {`${getName(match[0])} vs ${getName(match[1])}`}
                            </Row>
                            <Row md={12}>
                                {`${match[0].sets} : ${match[1].sets}`}
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <Button variant="secondary" onClick={handleClose}>
                    {t("historyModal.close")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default HistoryModal;
