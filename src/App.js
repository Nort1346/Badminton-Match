import "./App.css";
import { Row, Col, Container, Button, Stack, Dropdown } from "react-bootstrap";
import Counter from "./components/Counter";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "./components/Footer";
import Player from "./classes/Player";
import WinnerModal from "./components/WinnerModal";
import Sounds from "./Sounds";
import HandleSpeak from "./components/functions/handleSpeak.js";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";

const Colors = {
  Red: "Red",
  Blue: "Blue",
};

function App() {
  const { t } = useTranslation();
  const [playerOne, setPlayerOne] = useState(new Player(Colors.Red));
  const [playerTwo, setPlayerTwo] = useState(new Player(Colors.Blue));
  const [winnerModal, setWinnerModal] = useState({
    show: false,
    info: {},
    showed: false,
  });

  const checkSetWinner = useCallback((p1, p2, setP1) => {
    if (p1?.points >= 21 && p1?.points - p2?.points >= 2) {
      resetPlayersPoints();
      setP1((prev) => ({ ...prev, sets: p1.sets + 1 }));
      if (p1.sets < 1) {
        Sounds.set.play();
      }
    }
  }, []);

  const checkWinner = useCallback(() => {
    let winner = null;

    if (winnerModal.showed) return;

    if (playerOne.sets >= 2) {
      winner = {
        name: playerOne.name ?? `Player ${playerOne.color}`,
        variant: getVariant(playerOne.color),
        score: `${playerOne.sets} : ${playerTwo.sets}`,
      };
    } else if (playerTwo.sets >= 2) {
      winner = {
        name: playerTwo.name ?? `Player ${playerTwo.color}`,
        variant: getVariant(playerTwo.color),
        score: `${playerTwo.sets} : ${playerOne.sets}`,
      };
    }

    if (winner) {
      setWinnerModal((prev) => ({
        ...prev,
        info: winner,
        showed: true,
      }));
      Sounds.winning.play();
      handleOpenModal();
    }
  }, [playerOne, playerTwo, winnerModal.showed]);

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

  const handleOpenModal = () =>
    setWinnerModal((prev) => ({ ...prev, show: true }));

  const handleCloseModal = (reset) => {
    if (reset) resetPlayersScore();
    setWinnerModal((prev) => ({ ...prev, show: false }));
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
  };

  const resetPlayersPoints = () => {
    setPlayerOne((prev) => ({ ...prev, points: 0 }));
    setPlayerTwo((prev) => ({ ...prev, points: 0 }));
  };

  const getVariant = (color) => {
    const colorLow = color.toLowerCase();
    switch (colorLow) {
      case "red":
        return "danger";
      case "blue":
        return "primary";
      default:
        return "primary";
    }
  };

  const getName = (player) => {
    return (
      player.name ??
      `${t("player")} ${t(`colors.${player.color.toLowerCase()}`)}`
    );
  };

  const speakScore = () => {
    let winningName;
    const scores = [playerOne.points, playerTwo.points];
    scores.sort((a, b) => b - a);
    const p1Points = parseInt(playerOne.points);
    const p2Points = parseInt(playerTwo.points);

    if (p1Points > p2Points) {
      winningName = getName(playerOne);
    } else if (p2Points > p1Points) {
      winningName = getName(playerTwo);
    } else {
      const phrase = t("speech.draw", {
        scoreOne: scores[0],
        scoreTwo: scores[1],
      });
      return HandleSpeak(phrase);
    }

    const phrase = t("speech.score", {
      scoreOne: scores[0],
      scoreTwo: scores[1],
      winningName: winningName,
    });
    HandleSpeak(phrase);
  };

  return (
    <>
      <WinnerModal
        isShow={winnerModal.show}
        onClose={handleCloseModal}
        info={winnerModal.info}
      />
      <Container fluid className="m-0">
        <div className="d-flex justify-content-center fs-2 fw-bolder">
          {t("title")}
        </div>
        <div>
          <Row>
            <Col md={6} className={`py-3 bg-${getVariant(playerOne.color)}`}>
              <Counter player={playerOne} setPlayer={setPlayerOne} />
            </Col>

            <Col md={6} className={`py-3 bg-${getVariant(playerTwo.color)}`}>
              <Counter player={playerTwo} setPlayer={setPlayerTwo} />
            </Col>

            <Col
              md={12}
              className="py-2 bg-trasnparent d-flex align-items-center justify-content-center"
            >
              <Stack direction="horizontal" gap={2}>
                <Button
                  className="d-flex justify-content-center align-items-center"
                  onClick={resetPlayersScore}
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
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-megaphone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                  </svg>
                </Button>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-language"
                    size="md"
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
