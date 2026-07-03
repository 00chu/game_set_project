import { useEffect, useRef, useState } from "react";
import styles from "./Hangman.module.css";
import { useNavigate } from "react-router-dom";
import { saveRecordApi } from "../api";

const MAX_LIFE = 6;

const Hangman = () => {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isClear, setIsClear] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileInput, setMobileInput] = useState("");

  const inputRef = useRef(null);

  const wrongLetters = guessedLetters.filter(
    (letter) => !word.includes(letter),
  );

  const remainLife = MAX_LIFE - wrongLetters.length;

  const fetchWord = async () => {
    const response = await fetch("https://random-word-api.herokuapp.com/word");

    const data = await response.json();

    setWord(data[0].toUpperCase());
    setGuessedLetters([]);
    setIsGameOver(false);
    setIsClear(false);
  };

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectLetter = async (letter) => {
    if (guessedLetters.includes(letter) || isGameOver || isClear) {
      return;
    }

    const next = [...guessedLetters, letter];

    setGuessedLetters(next);

    const win = word.split("").every((char) => next.includes(char));

    if (win) {
      setIsClear(true);

      try {
        const playTime = Math.floor((Date.now() - startTime) / 1000);

        await saveRecordApi({
          gameName: "HANGMAN",
          score: remainLife,
          playTime,
        });
      } catch (e) {
        console.error(e);
      }

      return;
    }

    const wrongCount = next.filter((v) => !word.includes(v)).length;

    if (wrongCount >= MAX_LIFE) {
      setIsGameOver(true);
    }
  };

  const handleMobileInput = (e) => {
    const value = e.target.value.toUpperCase();

    if (!value) return;

    const letter = value[value.length - 1];

    if (!/^[A-Z]$/.test(letter)) return;

    selectLetter(letter);

    setMobileInput("");
  };

  if (!started) {
    return (
      <div className={styles.startContainer}>
        <HangmanStart
          onStart={() => {
            setStartTime(Date.now());
            setStarted(true);
          }}
          onRanking={() => navigate("/history/HANGMAN")}
        />
      </div>
    );
  }

  return (
    <div className={styles.hangman_game}>
      <div className={styles.left_panel}>
        <h2>
          ❤️ {remainLife} / {MAX_LIFE}
        </h2>

        <HangmanDrawing mistakes={wrongLetters.length} />
      </div>

      <div className={styles.right_panel}>
        <h1>HANGMAN</h1>

        <div className={styles.word}>
          {word.split("").map((char, i) => (
            <div key={i} className={styles.word_box}>
              {guessedLetters.includes(char) || isGameOver ? char : ""}
            </div>
          ))}
        </div>

        {isMobile ? (
          <div className={styles.mobile_input_area}>
            <input
              ref={inputRef}
              className={styles.hidden_input}
              type="text"
              value={mobileInput}
              onChange={handleMobileInput}
              autoCapitalize="characters"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
            />

            <button
              className={styles.mobile_input_btn}
              onClick={() => inputRef.current.focus()}
            >
              INPUT LETTER
            </button>
          </div>
        ) : (
          <HangmanKeyboard
            guessedLetters={guessedLetters}
            onSelect={selectLetter}
          />
        )}
      </div>

      {(isGameOver || isClear) && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverCard}>
            <h1>{isClear ? "🎉 CLEAR" : "💀 GAME OVER"}</h1>

            <p>정답: {word}</p>

            <div className={styles.btnRow}>
              <button onClick={() => window.location.reload()}>REPLAY</button>

              <button onClick={() => navigate("/history/HANGMAN")}>
                RANKING
              </button>

              <button onClick={() => navigate("/")}>HOME</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HangmanKeyboard = ({ guessedLetters, onSelect }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className={styles.keyboard}>
      {letters.map((letter) => (
        <button
          key={letter}
          disabled={guessedLetters.includes(letter)}
          className={styles.key}
          onClick={() => onSelect(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

const PARTS = [
  // 머리
  <circle
    key="head"
    cx="140"
    cy="75"
    r="25"
    stroke="currentColor"
    strokeWidth="5"
    fill="none"
  />,

  // 몸통
  <line
    key="body"
    x1="140"
    y1="100"
    x2="140"
    y2="180"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 왼팔
  <line
    key="left-arm"
    x1="140"
    y1="120"
    x2="105"
    y2="150"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 오른팔
  <line
    key="right-arm"
    x1="140"
    y1="120"
    x2="175"
    y2="150"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 왼다리
  <line
    key="left-leg"
    x1="140"
    y1="180"
    x2="110"
    y2="230"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 오른다리
  <line
    key="right-leg"
    x1="140"
    y1="180"
    x2="170"
    y2="230"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,
];

const HangmanDrawing = ({ mistakes }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        color: "white",
      }}
    >
      <svg width="260" height="320" viewBox="0 0 260 320">
        {/* 바닥 */}
        <line
          x1="20"
          y1="300"
          x2="220"
          y2="300"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 세로 기둥 */}
        <line
          x1="50"
          y1="20"
          x2="50"
          y2="300"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 가로 기둥 */}
        <line
          x1="50"
          y1="20"
          x2="140"
          y2="20"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 줄 */}
        <line
          x1="140"
          y1="20"
          x2="140"
          y2="50"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 사람 */}
        {PARTS.slice(0, mistakes)}
      </svg>
    </div>
  );
};

const HangmanStart = ({ onStart, onRanking }) => {
  return (
    <div className={styles.startScreen}>
      <h1 className={styles.startTitle}>💀 HANGMAN</h1>

      <div className={styles.startButtons}>
        <button onClick={onStart}>START</button>

        <button onClick={onRanking}>RANKING</button>
      </div>
    </div>
  );
};

export default Hangman;
