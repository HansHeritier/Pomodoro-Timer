import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faReact } from "@fortawesome/free-brands-svg-icons";

import startSound from "./audio/playpause.mp3";
import stopSound from "./audio/stop.mp3";
import finishSound from "./audio/finish.mp3";

const PomodoroTimer = () => {
  // États pour la durée des timers, temps restant, état du timer, etc.
  const [pomodoroDuration, setPomodoroDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [finalBreakDuration, setFinalBreakDuration] = useState(15 * 60);

  const [timeLeft, setTimeLeft] = useState(pomodoroDuration);

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [activeButton, setActiveButton] = useState(""); // Nouvel état pour le bouton actif
  const [pomodoroSliderValue, setPomodoroSliderValue] = useState(25);
  const [breakSliderValue, setBreakSliderValue] = useState(5);
  const [finalBreakSliderValue, setFinalBreakSliderValue] = useState(15);

  const pomodorosUntilLongBreak = 4;

  const element = <FontAwesomeIcon icon={faEnvelope} />;
  // Fonction pour mettre à jour le titre de l'onglet avec le temps restant
  const updateBrowserTabTitle = (time) => {
    const formattedTime = formatTime(time);
    document.title = `${formattedTime} Pomodoro Timer `;
  };

  // Création des instances Audio
  const startAudio = new Audio(startSound);
  const stopAudio = new Audio(stopSound);
  const finishAudio = new Audio(finishSound);

  // Effet useEffect pour gérer le timer
  useEffect(() => {
    let interval = null;

    // Fonction pour gérer la fin du timer
    const handleTimerEnd = () => {
      clearInterval(interval);

      if (timeLeft === 0) {
        finishAudio.play();
        setPomodoroCount((prevCount) => prevCount + 1);

        if (pomodoroCount < pomodorosUntilLongBreak * 2 - 1) {
          if (pomodoroCount % 2 === 0) {
            setTimeLeft(breakDuration);
          } else {
            setTimeLeft(pomodoroDuration);
          }
        } else {
          setTimeLeft(finalBreakDuration);
        }
      } else {
        updateBrowserTabTitle(timeLeft);
        setTimeLeft((prevTime) => prevTime - 1);
      }
    };

    // Configuration de l'intervalle
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        handleTimerEnd();
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Nettoyage de l'effet
  }, [
    isActive,
    isPaused,
    timeLeft,
    pomodoroCount,
    breakDuration,
    finalBreakDuration,
    pomodoroDuration,
    pomodorosUntilLongBreak,
  ]);

  // Fonction pour formater le temps en minutes et secondes
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  // Fonction pour gérer le clic sur le bouton Pomodoro
  const handlePomodoroClick = () => {
    setTimeLeft(pomodoroDuration);
    setPomodoroCount(0);
    setActiveButton("pomodoro"); // Mettre à jour le bouton actif
  };

  // Fonction pour gérer le clic sur le bouton Break
  const handleBreakClick = () => {
    setTimeLeft(breakDuration);
    setPomodoroCount(pomodoroCount + 1);
    setActiveButton("break"); // Mettre à jour le bouton actif
  };

  // Fonction pour gérer le clic sur le bouton Long Break
  const handleFinalBreakClick = () => {
    setTimeLeft(finalBreakDuration);
    setPomodoroCount(0);
    setActiveButton("finalBreak"); // Mettre à jour le bouton actif
  };

  // Fonction pour gérer le changement de valeur des sliders
  const handleSliderChange = (event, type) => {
    const sliderValue = parseInt(event.target.value);

    switch (type) {
      case "pomodoro":
        setPomodoroSliderValue(sliderValue);
        setPomodoroDuration(sliderValue * 60);
        setTimeLeft(sliderValue * 60);
        break;
      case "break":
        setBreakSliderValue(sliderValue);
        setBreakDuration(sliderValue * 60);
        setTimeLeft(sliderValue * 60);
        break;
      case "finalBreak":
        setFinalBreakSliderValue(sliderValue);
        setFinalBreakDuration(sliderValue * 60);
        setTimeLeft(sliderValue * 60);
        break;
      default:
        break;
    }
  };

  // Fonction pour démarrer le timer
  const startTimer = () => {
    startAudio.play();
    setIsActive(true);
    setIsPaused(false);
  };

  // Fonction pour mettre en pause le timer
  const pauseTimer = () => {
    startAudio.play();
    setIsActive(false);
    setIsPaused(true);
  };

  // Fonction pour reprendre le timer
  const resumeTimer = () => {
    startAudio.play();
    setIsActive(true);
    setIsPaused(false);
  };

  // Fonction pour réinitialiser le timer
  const resetTimer = () => {
    stopAudio.play();
    setTimeLeft(pomodoroDuration);
    setIsActive(false);
    setIsPaused(false);
    setPomodoroCount(0);
  };

  return (
    <div className="container-general">
      <div className="container-title">
        <p>Ready for a new challenge :</p>
      </div>
      <div className="container-button">
        <button
          onClick={handlePomodoroClick}
          className={activeButton === "pomodoro" ? "active" : ""}
        >
          POMODORO
        </button>
        <button
          onClick={handleBreakClick}
          className={activeButton === "break" ? "active" : ""}
        >
          BREAK
        </button>
        <button
          onClick={handleFinalBreakClick}
          className={activeButton === "finalBreak" ? "active" : ""}
        >
          LONG BREAK
        </button>
      </div>
      <div className="big-countdown-container">
        <div className="countdown-container">
          <p>{formatTime(timeLeft)}</p>
        </div>
      </div>
      <div className="button-countdown">
        {!isActive && !isPaused && (
          <button
            onClick={startTimer}
            className={activeButton === "" ? "active" : ""}
          >
            START
          </button>
        )}
        {isActive && (
          <button
            onClick={pauseTimer}
            className={activeButton === "" ? "active" : ""}
          >
            PAUSE
          </button>
        )}
        {!isActive && isPaused && (
          <button
            onClick={resumeTimer}
            className={activeButton === "" ? "active" : ""}
          >
            RESUME
          </button>
        )}
        <button
          onClick={resetTimer}
          className={activeButton === "" ? "active" : ""}
        >
          RESET
        </button>
      </div>
      <div className="container-settings">
        <p>Adjust time &#x1F44C;</p>
        <div className="container-general-slider">
          <div className="slider-container">
            <label>Pomodoro</label>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={pomodoroSliderValue}
              onChange={(e) => handleSliderChange(e, "pomodoro")}
            />
            <p>{pomodoroDuration / 60} min</p>
          </div>
          <div className="slider-container">
            <label>Break</label>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={breakSliderValue}
              onChange={(e) => handleSliderChange(e, "break")}
            />
            <p>{breakDuration / 60} min</p>
          </div>
          <div className="slider-container">
            <label>Long Break</label>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={finalBreakSliderValue}
              onChange={(e) => handleSliderChange(e, "finalBreak")}
            />
            <p>{finalBreakDuration / 60} min</p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Build by HansWebDev with</p>
        <FontAwesomeIcon icon={faReact} className="icon" />
      </div>
    </div>
  );
};

export default PomodoroTimer;
