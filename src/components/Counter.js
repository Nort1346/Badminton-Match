import {
  Row,
  Container,
  Form,
  Button,
  Col,
  ProgressBar,
} from "react-bootstrap";
// eslint-disable-next-line
import Player from "../classes/Player";
import Sounds from "../Sounds";
import { useTranslation } from "react-i18next";

/**
 * @param {Object} props
 * @param {Player} props.player
 * @param {void} props.setPlayer
 * @returns {JSX.Element}
 */
function Counter({ player, setPlayer }) {
  const { t } = useTranslation();

  const addPoint = () => {
    if (player.sets >= 2) return;
    setPlayer((prev) => ({ ...prev, points: player.points + 1 }));
    Sounds.point.play();
  };

  const removePoint = () => {
    if (player.points <= 0) return;
    setPlayer((prev) => ({ ...prev, points: player.points - 1 }));
  };

  const addSet = () => {
    if (player.sets >= 2) return;
    if (player.sets === 0) Sounds.set.play();
    setPlayer((prev) => ({ ...prev, sets: player.sets + 1 }));
  };

  const removeSet = () => {
    if (player.sets <= 0) return;
    setPlayer((prev) => ({ ...prev, sets: player.sets - 1 }));
  };

  const getVariant = () => {
    const color = player.color.toLowerCase();
    switch (color) {
      case "red":
        return "primary";
      case "blue":
        return "danger";
      default:
        return "primary";
    }
  };

  const updateName = (obj) => {
    setPlayer((prev) => ({ ...prev, name: obj.target.value }));
  };

  return (
    <Container fluid className="m-0 p-3">
      <Row md={12} className="mb-3">
        <Form.Control
          type="text"
          placeholder={`${t('player')} ${t(`colors.${player.color.toLowerCase()}`)}`}
          size="lg"
          className="border border-0 bg-transparent player-input"
          id={player.color}
          onChange={updateName}
          value={player.name ?? ""}
        />
      </Row>
      <Row md={12} className="d-flex justify-content-center fs-1 fw-bold">
        <ProgressBar
          now={player.sets}
          min={0}
          max={2}
          label={`${player.sets} ${t('set')}`}
          striped={true}
          animated={true}
          variant="success"
          className="p-0"
        />
      </Row>
      <Row md={12} className="my-5 d-flex justify-content-center fs-1 fw-bold">
        {player.points}
      </Row>
      <Row md={12} className="my-3">
        <Button variant={getVariant()} size="lg" onClick={addPoint}>
          +
        </Button>
      </Row>
      <Row md={12} className="my-3">
        <Button variant={getVariant()} size="lg" onClick={removePoint}>
          -
        </Button>
      </Row>
      <Row md={12}>
        <Col xs={6}>
          <Button
            variant={getVariant()}
            className={`w-100 border border-light text-truncate`}
            onClick={addSet}
          >
            +&nbsp;{t('set')}
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            variant={getVariant()}
            className={`w-100 border border-light text-truncate`}
            onClick={removeSet}
          >
            -&nbsp;{t('set')}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Counter;
