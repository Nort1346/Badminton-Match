import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DefaultValues from "./DefaultValues.json";
import GameSettingType from "./enums/GameSettingType";
import fetchLeadPoints from "./functions/fetchLeadPoints";
import fetchPoints from "./functions/fetchPoints";
import fetchSets from "./functions/fetchSets";

function SettingModal({ isShow, onClose }) {
    const { t } = useTranslation();
    const [show, setShow] = useState(isShow);
    const [sets, setSets] = useState(fetchSets());
    const [points, setPoints] = useState(fetchPoints());
    const [leadPoints, setLeadPoints] = useState(fetchLeadPoints());

    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    const handleClose = () => {
        setShow(false);
        if (onClose) onClose();
    };

    const handleSetsChange = (e) => {
        setSets(e.target.value);
        localStorage.setItem(GameSettingType.Sets, e.target.value);
    };

    const handlePointsChange = (e) => {
        setPoints(e.target.value);
        localStorage.setItem(GameSettingType.Points, e.target.value);
    };

    const handleLeadPointsChange = (e) => {
        setLeadPoints(e.target.value);
        localStorage.setItem(GameSettingType.LeadPoint, e.target.value);
    };

    const resetToDefaults = () => {
        setSets(DefaultValues.SETS);
        setPoints(DefaultValues.POINTS);
        setLeadPoints(DefaultValues.LEAD_POINTS);
        localStorage.setItem(GameSettingType.Sets, DefaultValues.SETS);
        localStorage.setItem(GameSettingType.Points, DefaultValues.POINTS);
        localStorage.setItem(GameSettingType.LeadPoint, DefaultValues.LEAD_POINTS);
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered={true}
            size="lg"
        >
            <Modal.Header className="d-flex justify-content-center border-0">
                <Modal.Title className="fs-4 fw-bolder text-center">
                    {t("settingModal.settings")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5 fw-semibold text-left">
                <Form.Label>{t('settingModal.sets')}&nbsp;<span className="text-primary fw-bolder">{sets}</span></Form.Label>
                <Form.Range max={5} min={1} defaultValue={2} value={sets} onChange={handleSetsChange} />

                <Form.Label>{t('settingModal.points')}&nbsp;<span className="text-primary fw-bolder">{points}</span></Form.Label>
                <Form.Range max={99} min={1} defaultValue={21} value={points} onChange={handlePointsChange} />

                <Form.Label>{t('settingModal.leadPoints')}&nbsp;<span className="text-primary fw-bolder">{leadPoints}</span></Form.Label>
                <Form.Range max={20} min={0} defaultValue={2} value={leadPoints} onChange={handleLeadPointsChange} />
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <Button variant="primary" onClick={resetToDefaults}>
                    {t("settingModal.resetDefault")}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    {t("winnerModal.close")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SettingModal;
