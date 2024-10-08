import "./App.css";
import { Row, Col, Container, Stack } from "react-bootstrap";
import Counter from "./components/Counter";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "./components/Footer";
import Player from "./components/classes/Player.js";
import WinnerModal from "./components/WinnerModal";
import playSound from "./components/functions/playSound.js";
import HandleSpeak from "./components/functions/handleSpeak.js";
import { useTranslation } from "react-i18next";
import startConfetti from "./components/functions/startConfetti.js";
import Colors from "./components/enums/Colors.js";
import toggleFullScreen from "./components/functions/toggleFullScreen.js";
import getRandomColor from "./components/functions/getRandomColor.js";
import Sounds from "./components/enums/Sounds.js";
import SettingModal from "./components/SettingModal";
import fetchPoints from "./components/functions/fetchPoints";
import fetchLeadPoints from "./components/functions/fetchLeadPoints";
import fetchSets from "./components/functions/fetchSets";
import SettingButton from "./components/buttons/SettingButton";
import FullScreenButton from "./components/buttons/FullScreenButton";
import SpeakButton from "./components/buttons/SpeakButton";
import InvertButton from "./components/buttons/InvertButton";
import LanguageButton from "./components/buttons/LanguageButton";
import ResetButton from "./components/buttons/ResetButton";
import HistoryButton from "./components/buttons/HistoryButton";
import HistoryModal from "./components/HistoryModal";

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
  const [historyModal, setHistoryModal] = useState(false);

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
      startConfetti();
      setWinnerModal((prev) => ({
        ...prev,
        info: winner,
        showed: true,
      }));
      playSound(Sounds.Winning);
      handleOpenWinnerModal();
      setServingPlayer((prev) => null);
      const matchObject = [
        { name: playerOne.name, sets: playerOne.sets, color: playerOne.color },
        { name: playerTwo.name, sets: playerTwo.sets, color: playerTwo.color },
      ];
      const history = JSON.parse(localStorage.getItem("HISTORY")) ?? [];
      history.unshift(matchObject);
      if (history.length > 15) history.pop();
      localStorage.setItem("HISTORY", JSON.stringify(history));
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

  const handleOpenSettingModal = () => setSettingModal((prev) => true);

  const handleCloseSettingModal = (reset) => {
    if (reset) resetPlayersScore();
    setSettingModal((prev) => false);
  };

  const handleOpenHistoryModal = () => setHistoryModal((prev) => true);

  const handleCloseHistoryModal = () => {
    setHistoryModal((prev) => false);
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
    setServingPlayer((prev) => getRandomColor());
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
        : Math.max(points - scores[0], leadPoints - pointsSubtraction);

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
      <SettingModal isShow={settingModal} onClose={handleCloseSettingModal} />
      <HistoryModal isShow={historyModal} onClose={handleCloseHistoryModal} />
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
                <ResetButton onClick={resetPlayersScore} />
                <InvertButton onClick={invertPlayers} />
                <SpeakButton onClick={speakScore} />
                <FullScreenButton onClick={toggleFullScreen} />
                <SettingButton onClick={handleOpenSettingModal} />
                <HistoryButton onClick={handleOpenHistoryModal} />
                <LanguageButton />
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
