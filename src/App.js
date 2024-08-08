import "./App.css";
import { Row, Col, Container, Button, Stack } from "react-bootstrap";
import Counter from "./components/Counter";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "./components/Footer";
import Player from "./classes/Player";
import WinnerModal from "./components/WinnerModal";
import Sounds from "./Sounds";

const Colors = {
  Red: "Red",
  Blue: "Blue",
};

function App() {
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
        document.title = `${playerOne.name} vs ${playerTwo.name} | Badminton Match`;
      } else {
        document.title = `Badminton Match`;
      }
    };

    checkSetWinner(playerOne, playerTwo, setPlayerOne);
    checkSetWinner(playerTwo, playerOne, setPlayerTwo);
    checkWinner();
    updateTitle();
  }, [playerOne, playerTwo, checkSetWinner, checkWinner]);

  const handleOpenModal = () =>
    setWinnerModal((prev) => ({ ...prev, show: true }));
  const handleCloseModal = () =>
    setWinnerModal((prev) => ({ ...prev, show: false }));

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

  return (
    <>
      <WinnerModal
        isShow={winnerModal.show}
        onClose={handleCloseModal}
        info={winnerModal.info}
      />
      <Container fluid className="m-0">
        <div className="d-flex justify-content-center fs-2 fw-bolder">
          Badminton
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
