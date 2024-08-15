import "./App.css";
import { Row, Col, Container, Button, Stack, Dropdown } from "react-bootstrap";
import Counter from "./components/Counter";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "./components/Footer";
import Player from "./components/classes/Player.js";
import WinnerModal from "./components/WinnerModal";
import playSound from "./components/functions/playSound.js";
import HandleSpeak from "./components/functions/handleSpeak.js";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import startConfetti from "./components/functions/startConfetti.js";
import Colors from "./components/enums/Colors.js";
import toggleFullScreen from "./components/functions/toggleFullScreen.js";
import getRandomColor from "./components/functions/getRandomColor.js";
import Sounds from "./components/enums/Sounds.js";
import SettingModal from "./components/SettingModal";
import fetchPoints from "./components/functions/fetchPoints";
import fetchLeadPoints from "./components/functions/fetchLeadPoints";
import fetchSets from "./components/functions/fetchSets";

function App() {
  const { t } = useTranslation();
  const [playerOne, setPlayerOne] = useState(new Player(Colors.Red));
  const [playerTwo, setPlayerTwo] = useState(new Player(Colors.Blue));
  const [servingPlayer, setServingPlayer] = useState(getRandomColor());
  const [winnerModal, setWinnerModal] = useState({
    show: false,
    info: {},
    showed: false,
  });
  const [settingModal, setSettingModal] = useState(false);

  const getName = useCallback(
    (player) => {
      return player.name || t(`players.${player.color.toLowerCase()}Player`);
    },
    [t]
  );

  const checkSetWinner = useCallback((p1, p2, setP1) => {
    const points = fetchPoints();
    if (p1?.points >= points && p1?.points - p2?.points >= fetchLeadPoints()) {
      resetPlayersPoints();
      setP1((prev) => ({ ...prev, sets: p1.sets + 1 }));
      if (p1.sets < fetchSets() - 1) {
        playSound(Sounds.Set);
      }
    }
  }, []);

  const checkWinner = useCallback(() => {
    let winner = null;

    if (winnerModal.showed) return;
    const sets = fetchSets();

    if (playerOne.sets >= sets) {
      winner = {
        name: getName(playerOne),
        variant: getVariant(playerOne.color),
        score: `${playerOne.sets} : ${playerTwo.sets}`,
      };
    } else if (playerTwo.sets >= sets) {
      winner = {
        name: getName(playerTwo),
        variant: getVariant(playerTwo.color),
        score: `${playerTwo.sets} : ${playerOne.sets}`,
      };
    }

    if (winner) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      startConfetti();
      setWinnerModal((prev) => ({
        ...prev,
        info: winner,
        showed: true,
      }));
      playSound(Sounds.Winning);
      handleOpenWinnerModal();
      setServingPlayer((prev) => null);
      resetPlayersPoints();
    }
  }, [playerOne, playerTwo, winnerModal.showed, getName]);

  useEffect(() => {
    const updateTitle = () => {
      if (playerOne.name && playerTwo.name) {
        document.title = `${playerOne.name} vs ${playerTwo.name} | ${t(
          "fullTitle"
        )}`;
      } else {
        document.title = t("fullTitle");
      }
    };

    checkSetWinner(playerOne, playerTwo, setPlayerOne);
    checkSetWinner(playerTwo, playerOne, setPlayerTwo);
    checkWinner();
    updateTitle();
  }, [playerOne, playerTwo, checkSetWinner, checkWinner, t]);

  const handleOpenWinnerModal = () =>
    setWinnerModal((prev) => ({ ...prev, show: true }));

  const handleCloseWinnerModal = (reset) => {
    if (reset) resetPlayersScore();
    setWinnerModal((prev) => ({ ...prev, show: false }));
  };

  const handleOpenSettingModal = () =>
    setSettingModal((prev) => (true));

  const handleCloseSettingModal = () => {
    setSettingModal((prev) => (false));
  };

  const invertPlayers = () => {
    setPlayerOne((prevPlayerOne) => playerTwo);
    setPlayerTwo((prevPlayerTwo) => playerOne);
  };

  const resetPlayersScore = () => {
    setPlayerOne((prev) => ({ ...prev, points: 0, sets: 0 }));
    setPlayerTwo((prev) => ({ ...prev, points: 0, sets: 0 }));
    setWinnerModal((prev) => ({
      ...prev,
      showed: false,
    }));
    setServingPlayer((prev) => getRandomColor())
  };

  const resetPlayersPoints = () => {
    setPlayerOne((prev) => ({ ...prev, points: 0 }));
    setPlayerTwo((prev) => ({ ...prev, points: 0 }));
  };

  const getVariant = (color) => {
    switch (color) {
      case Colors.Red:
        return "danger";
      case Colors.Blue:
        return "primary";
      default:
        return "primary";
    }
  };

  const speakScore = () => {
    let winningName;
    const scores = [playerOne.points, playerTwo.points];
    scores.sort((a, b) => b - a);
    const p1Points = playerOne.points;
    const p2Points = playerTwo.points;
    const sets = fetchSets();
    const points = fetchPoints();
    const leadPoints = fetchLeadPoints();

    if (playerOne.sets === sets) {
      const phrase = t("speech.playerWins", {
        player: getName(playerOne),
      });
      return HandleSpeak(phrase);
    } else if (playerTwo.sets === sets) {
      const phrase = t("speech.playerWins", {
        player: getName(playerTwo),
      });
      return HandleSpeak(phrase);
    }

    if (p1Points > p2Points) {
      winningName = getName(playerOne);
    } else if (p2Points > p1Points) {
      winningName = getName(playerTwo);
    } else if (p1Points === p2Points) {
      const phrase = t("speech.draw", {
        scoreOne: scores[0],
        scoreTwo: scores[1],
      });
      return HandleSpeak(phrase);
    }

    const pointsSubtraction = scores[0] - scores[1];
    const pointsNeeded =
      scores[0] >= points && pointsSubtraction >= leadPoints
        ? 0
        : Math.max(
          points - scores[0],
          leadPoints - pointsSubtraction
        );

    if (pointsNeeded <= leadPoints && pointsNeeded >= 1) {
      const phrase = t("speech.needPointsToWinSet", {
        player: winningName,
        points: pointsNeeded,
      });
      return HandleSpeak(phrase);
    }

    const phrase = t("speech.score", {
      scoreOne: scores[0],
      scoreTwo: scores[1],
      winningName: winningName,
    });
    return HandleSpeak(phrase);
  };

  return (
    <>
      <div id="confetti"></div>
      <WinnerModal
        isShow={winnerModal.show}
        onClose={handleCloseWinnerModal}
        info={winnerModal.info}
      />
      <SettingModal
        isShow={settingModal}
        onClose={handleCloseSettingModal}
      />
      <Container fluid className="m-0">
        <div className="d-flex justify-content-center fs-2 fw-bolder">
          {t("title")}
        </div>
        <div>
          <Row>
            <Col sm={6} className={`py-3 bg-${getVariant(playerOne.color)}`}>
              <Counter
                player={playerOne}
                setPlayer={setPlayerOne}
                disabled={winnerModal.showed}
                servingPlayer={{ color: servingPlayer, set: setServingPlayer }}
              />
            </Col>

            <Col sm={6} className={`py-3 bg-${getVariant(playerTwo.color)}`}>
              <Counter
                player={playerTwo}
                setPlayer={setPlayerTwo}
                disabled={winnerModal.showed}
                servingPlayer={{ color: servingPlayer, set: setServingPlayer }}
              />
            </Col>

            <Col
              md={12}
              className="py-2 bg-trasnparent d-flex align-items-center justify-content-center"
            >
              <Stack
                direction="horizontal"
                gap={2}
                className="flex-wrap justify-content-center"
              >
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={resetPlayersScore}
                  size="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                  </svg>
                </Button>
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={invertPlayers}
                  size="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-left-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                    />
                  </svg>
                </Button>
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={speakScore}
                  size="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    className="bi bi-megaphone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                  </svg>
                </Button>
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={toggleFullScreen}
                  size="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-fullscreen"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
                  </svg>
                </Button>
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={handleOpenSettingModal}
                  size="lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sliders2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                  </svg>
                </Button>
                <Dropdown drop="up" align={{ md: "start" }}>
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-language"
                    size="lg"
                    className="d-flex align-items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-translate"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
                      <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" />
                    </svg>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => changeLanguage("en")}>
                      English
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("pl")}>
                      Polski
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => changeLanguage("de")}>
                      Deutsch
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Stack>
            </Col>
          </Row>
        </div>
        <Footer />
      </Container>
    </>
  );
}

export default App;
