import {
  Row,
  Container,
  Form,
  Button,
  Col,
  ProgressBar,
} from "react-bootstrap";
// eslint-disable-next-line
import Player from "./classes/Player";
import playSound from "./functions/playSound";
import { useTranslation } from "react-i18next";
import Colors from "./enums/Colors";
import { ReactComponent as Shuttle } from "./icons/shuttle.svg";
import Sounds from "./enums/Sounds";

/**
 * @param {Object} props
 * @param {Player} props.player
 * @param {void} props.setPlayer
 * @param {{color: Colors, set: void}} props.servingPlayer
 * @returns {JSX.Element}
 */
function Counter({ player, setPlayer, servingPlayer, disabled }) {
  const { t } = useTranslation();

  const setServingPlayerColor = () => {
    servingPlayer.set((prev) => player.color);
  };

  const addPoint = () => {
    if (player.sets >= 2) return;
    setPlayer((prev) => ({ ...prev, points: player.points + 1 }));
    playSound(Sounds.Point);
    setServingPlayerColor();
  };

  const removePoint = () => {
    if (player.points <= 0) return;
    setPlayer((prev) => ({ ...prev, points: player.points - 1 }));
  };

  const addSet = () => {
    if (player.sets >= 2) return;
    if (player.sets === 0) playSound(Sounds.Set);
    setPlayer((prev) => ({ ...prev, sets: player.sets + 1 }));
    if (player.points === 0) setServingPlayerColor();
  };

  const removeSet = () => {
    if (player.sets <= 0) return;
    setPlayer((prev) => ({ ...prev, sets: player.sets - 1 }));
  };

  const getVariant = () => {
    const color = player.color;
    switch (color) {
      case Colors.Red:
        return "primary";
      case Colors.Blue:
        return "danger";
      default:
        return "primary";
    }
  };

  const updateName = (obj) => {
    setPlayer((prev) => ({ ...prev, name: obj.target.value }));
  };

  return (
    <Container fluid className="m-0 p-3 pt-0">
      <Row md={12} className="mb-3 d-flex justify-content-center">
        <Col
          xs={12}
          className="d-flex align-items-center justify-content-center"
        >
          <Shuttle
            width="15"
            height="15"
            className={
              player.color !== servingPlayer.color ? "d-block" : undefined
            }
            style={{
              opacity: player.color !== servingPlayer.color ? 0 : 1,
            }}
          />
        </Col>
        <Col xs={12} className="p-0">
          <Form.Control
            type="text"
            placeholder={t(`players.${player.color.toLowerCase()}Player`)}
            size="lg"
            className="border border-0 bg-transparent player-input p-0"
            id={player.color}
            onChange={updateName}
            value={player.name || ""}
          />
        </Col>
      </Row>
      <Row md={12} className="d-flex justify-content-center fs-1 fw-bold pe-1">
        <ProgressBar
          now={player.sets}
          min={0}
          max={2}
          label={`${player.sets} ${t("set")}`}
          striped={true}
          animated={true}
          variant="success"
          className="p-0"
        />
      </Row>
      <Row
        md={12}
        className="my-5 d-flex justify-content-center align-items-center fs-1 fw-bold"
      >
        {player.points}
      </Row>
      <Row md={12} className="my-3">
        <Button
          variant={getVariant()}
          size="lg"
          onClick={addPoint}
          disabled={disabled}
        >
          +
        </Button>
      </Row>
      <Row md={12} className="my-3">
        <Button
          variant={getVariant()}
          size="lg"
          onClick={removePoint}
          disabled={disabled}
        >
          -
        </Button>
      </Row>
      <Row md={12}>
        <Col xs={6}>
          <Button
            variant={getVariant()}
            className={`w-100 border border-light text-truncate`}
            onClick={addSet}
            disabled={disabled}
          >
            +&nbsp;{t("set")}
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            variant={getVariant()}
            className={`w-100 border border-light text-truncate`}
            onClick={removeSet}
            disabled={disabled}
          >
            -&nbsp;{t("set")}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Counter;
