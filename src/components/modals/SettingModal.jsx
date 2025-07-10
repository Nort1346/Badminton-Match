import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DefaultValues from "@/DefaultValues.json";
import GameSettingType from "@/enums/GameSettingType";
import fetchLeadPoints from "@/functions/fetchLeadPoints";
import fetchPoints from "@/functions/fetchPoints";
import fetchSets from "@/functions/fetchSets";

function SettingModal({ isShow, onClose }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(isShow);
  const [sets, setSets] = useState(fetchSets());
  const [points, setPoints] = useState(fetchPoints());
  const [leadPoints, setLeadPoints] = useState(fetchLeadPoints());

  useEffect(() => {
    const loadData = () => {
      setSets(fetchSets());
      setPoints(fetchPoints());
      setLeadPoints(fetchLeadPoints());
    };

    if (isShow) {
      loadData();
    }
    setShow(isShow);
  }, [isShow]);

  const handleClose = (changes) => {
    setShow(false);
    if (onClose) onClose(changes === true);
  };

  const handleSetsChange = (e) => {
    setSets(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };

  const handleLeadPointsChange = (e) => {
    setLeadPoints(e.target.value);
  };

  const resetToDefaults = () => {
    setSets(DefaultValues.SETS);
    setPoints(DefaultValues.POINTS);
    setLeadPoints(DefaultValues.LEAD_POINTS);
  };

  const applyChanges = () => {
    let changes = !(
      fetchSets() === sets &&
      fetchPoints() === points &&
      fetchLeadPoints() === leadPoints
    );
    localStorage.setItem(GameSettingType.Sets, sets);
    localStorage.setItem(GameSettingType.Points, points);
    localStorage.setItem(GameSettingType.LeadPoint, leadPoints);
    handleClose(changes);
  };

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
        <Form.Label htmlFor="sets">
          {t("settingModal.sets")}&nbsp;
          <span className="text-primary fw-bolder">{sets}</span>
        </Form.Label>
        <Form.Range
          name="sets"
          max={5}
          min={1}
          value={sets}
          onChange={handleSetsChange}
        />

        <Form.Label htmlFor="points">
          {t("settingModal.points")}&nbsp;
          <span className="text-primary fw-bolder">{points}</span>
        </Form.Label>
        <Form.Range
          name="points"
          max={99}
          min={1}
          value={points}
          onChange={handlePointsChange}
        />

        <Form.Label htmlFor="lead-points">
          {t("settingModal.leadPoints")}&nbsp;
          <span className="text-primary fw-bolder">{leadPoints}</span>
        </Form.Label>
        <Form.Range
          name="lead-points"
          max={20}
          min={0}
          value={leadPoints}
          onChange={handleLeadPointsChange}
        />
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="danger" onClick={resetToDefaults}>
          {t("settingModal.resetDefault")}
        </Button>
        <Button variant="primary" onClick={applyChanges}>
          {t("settingModal.apply")}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          {t("settingModal.cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingModal;
