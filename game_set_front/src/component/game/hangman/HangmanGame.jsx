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
        <h2>❤️ {remainLife}</h2>

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

const HangmanDrawing = ({ mistakes }) => {
  const stages = [
    "",
    "😵",
    "😵\n |",
    "😵\n/|",
    "😵\n/|\\",
    "😵\n/|\\\n/",
    "😵\n/|\\\n/ \\",
  ];

  return (
    <pre className={styles.hangman_draw}>
      {`
 +----+
 |    |
 |    ${stages[mistakes]}
 |
 |
=========
`}
    </pre>
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
