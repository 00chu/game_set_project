import { useEffect, useRef, useState } from "react";
import styles from "./ColorMatch.module.css";
import { useNavigate } from "react-router-dom";
import { saveRecordApi } from "./api";

const COLORS = [
  { name: "red", kor: "빨강", color: "#ff3232" },
  { name: "orange", kor: "주황", color: "#f97316" },
  { name: "yellow", kor: "노랑", color: "#facc15" },
  { name: "green", kor: "초록", color: "#22c55e" },
  { name: "blue", kor: "파랑", color: "#3b82f6" },
  { name: "purple", kor: "보라", color: "#a855f7" },
  { name: "black", kor: "검정", color: "#030508" },
];

const ColorMatch = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(0);
  const [word, setWord] = useState();
  const [wordColor, setWordColor] = useState();
  const [buttonList, setButtonList] = useState([]);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(100);

  const timerRef = useRef(null);
  const gameOverRef = useRef(false);

  const shuffle = (arr) => (Math.random() > 0.5 ? arr : [arr[1], arr[0]]);

  const generateGame = () => {
    const list = COLORS;

    const randomIndex = Math.floor(Math.random() * list.length);
    const randomWord = list[randomIndex];

    let randomColorObj;
    while (true) {
      const temp = list[Math.floor(Math.random() * list.length)];
      if (temp.name !== randomWord.name) {
        randomColorObj = temp;
        break;
      }
    }

    const arr = shuffle([randomWord, randomColorObj]);

    if (language === 1) {
      // 한국어 모드
      setWord(randomWord.kor);
      setWordColor(randomColorObj.color);
      setButtonList(arr.map((v) => v.kor));
    } else {
      // 영어 모드
      setWord(randomWord.name);
      setWordColor(randomColorObj.color);
      setButtonList(arr.map((v) => v.name));
    }
  };

  const match = (value) => {
    if (gameOverRef.current) return;

    const target = COLORS.find((c) =>
      language === 1 ? c.kor === value : c.name === value,
    );

    const targetColor = COLORS.find((c) => c.color === wordColor);

    if (target?.name === targetColor?.name) {
      setCount((prev) => prev + 1);
    } else {
      handleWrong();
    }
  };

  // 게임 종료
  const handleWrong = () => {
    if (gameOverRef.current) return;

    gameOverRef.current = true;

    // 게임 종료 화면 즉시 표시
    setOver(true);

    if (timerRef.current) clearInterval(timerRef.current);
  };

  // 중복 저장 방지
  const savedRef = useRef(false);

  // 백그라운드에서 기록 저장
  useEffect(() => {
    if (!over) return;
    if (savedRef.current) return;

    savedRef.current = true;

    (async () => {
      try {
        await saveRecordApi({
          gameName: "COLOR_MATCH",
          score: count,
          playTime: time,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [over]);

  const formatTime = (time) => {
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (language !== 0 && !over) {
      generateGame();
    }
  }, [count, language]);

  // 타이머
  useEffect(() => {
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    if (over) clearInterval(id);
    return () => clearInterval(id);
  }, [over]);

  useEffect(() => {
    if (language === 0 || over) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setProgress(100);

    const duration = 3000;
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    let current = 100;

    timerRef.current = setInterval(() => {
      current -= step;
      setProgress(current);

      if (current <= 0) {
        clearInterval(timerRef.current);
        if (!gameOverRef.current) handleWrong();
      }
    }, intervalTime);

    return () => clearInterval(timerRef.current);
  }, [count, language]);

  return (
    <div className={styles.colorMatch_game}>
      {language === 0 && (
        <ColorMatchStart
          setLanguage={setLanguage}
          setCount={setCount}
          navigate={navigate}
          gameOverRef={gameOverRef}
        />
      )}

      {language !== 0 && (
        <ColorMatchMain
          count={count}
          time={time}
          word={word}
          wordColor={wordColor}
          buttonList={buttonList}
          match={match}
          formatTime={formatTime}
          progress={progress}
        />
      )}

      {over && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverCard}>
            <h1>GAME OVER</h1>
            <p>Correct: {count}</p>
            <p>Time: {formatTime(time)}</p>

            <div className={styles.btnRow}>
              <button onClick={() => window.location.reload()}>REPLAY</button>
              <button onClick={() => navigate("/history/COLOR_MATCH")}>
                HISTORY
              </button>
              <button onClick={() => navigate("/")}>HOME</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ColorMatchStart = ({ setLanguage, setCount, gameOverRef, navigate }) => {
  return (
    <main className={styles.start}>
      <div className={styles.game_title}>
        <p>COLOR</p>
        <p>MATCH</p>
      </div>

      <div className={styles.language}>
        <button
          onClick={() => {
            setLanguage(1);
            setCount(0);
            gameOverRef.current = false;
          }}
        >
          한국어
        </button>

        <button
          onClick={() => {
            setLanguage(2);
            setCount(0);
            gameOverRef.current = false;
          }}
        >
          English
        </button>

        <button
          className={styles.historyBtn}
          onClick={() => navigate("/history/COLOR_MATCH")}
        >
          RANKING
        </button>
      </div>
    </main>
  );
};

const ColorMatchMain = ({
  count,
  time,
  word,
  wordColor,
  buttonList,
  match,
  formatTime,
  progress,
}) => {
  return (
    <main>
      <div className={styles.progress}>
        <p>count: {count}</p>
        <p>time: {formatTime(time)}</p>
      </div>

      <div className={styles.word_zone}>
        <div className={styles.progress_bar}>
          <div
            className={styles.progress_fill}
            style={{
              width: `${progress}%`,
              background:
                progress > 50
                  ? "#6D28D9"
                  : progress > 20
                    ? "#F59E0B"
                    : "#EF4444",
            }}
          />
        </div>

        <p className={styles.main_title}>🎨</p>

        <p className={styles.color_word} style={{ color: wordColor }}>
          {word}
        </p>

        <div className={styles.btn_zone}>
          {buttonList.map((i, index) => (
            <button
              key={i + index}
              className={styles.color_btn}
              onClick={() => match(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ColorMatch;
