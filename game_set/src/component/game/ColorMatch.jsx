import { useEffect, useRef, useState } from "react";
import styles from "./colorMatch.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ColorMatch = () => {
  const navigate = useNavigate();

  const colorEng = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "black",
  ];
  const colorKor = ["빨강", "주황", "노랑", "초록", "파랑", "보라", "검정"];

  const [language, setLanguage] = useState(0);
  const [word, setWord] = useState();
  const [wordColor, setWordColor] = useState();
  const [buttonList, setButtonList] = useState([]);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const GameOverRef = useRef(false);

  const shuffle = (arr) => {
    return Math.random() > 0.5 ? arr : [arr[1], arr[0]];
  };

  const generateGame = () => {
    if (language === 1) {
      const randomWord = colorKor[Math.floor(Math.random() * colorKor.length)];

      let randomColor;

      while (true) {
        const temp = colorKor[Math.floor(Math.random() * colorKor.length)];
        if (temp !== randomWord) {
          randomColor = temp;
          break;
        }
      }

      const arr = shuffle([randomWord, randomColor]);

      setWord(randomWord);
      setWordColor(colorEng[colorKor.indexOf(randomColor)]);
      setButtonList(arr);
    } else {
      const randomWord = colorEng[Math.floor(Math.random() * colorEng.length)];

      let randomColor;

      while (true) {
        const temp = colorEng[Math.floor(Math.random() * colorEng.length)];
        if (temp !== randomWord) {
          randomColor = temp;
          break;
        }
      }

      const arr = shuffle([randomWord, randomColor]);

      setWord(randomWord);
      setWordColor(randomColor);
      setButtonList(arr);
    }
  };

  const match = (i) => {
    if (GameOverRef.current) return;
    //한국어일때 영어일때
    if (language === 1) {
      if (colorEng.indexOf(wordColor) === colorKor.indexOf(i)) {
        setCount((prev) => prev + 1);
      } else {
        handleWrong();
      }
    } else {
      if (i === wordColor) {
        setCount((prev) => prev + 1);
      } else {
        handleWrong();
      }
    }
  };

  const handleWrong = async () => {
    if (GameOverRef.current) return;

    GameOverRef.current = true;
    setOver(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const result = await Swal.fire({
      title: "Game Over",
      icon: "error",
      text: `Correct: ${count}, time: ${formatTime(time)}`,
      showCancelButton: true,
      confirmButtonColor: "#6D28D9",
      cancelButtonColor: "rgb(0, 0, 0)",
      confirmButtonText: "REPLAY",
      cancelButtonText: "HOME",
    });

    if (result.isConfirmed) {
      window.location.reload();
    }

    if (result.isDismissed) {
      navigate("/");
    }
  };

  const formatTime = (time) => {
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (count !== undefined) {
      generateGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, language]);

  useEffect(() => {
    const id = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    if (over) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [over]);

  useEffect(() => {
    if (language === 0 || over) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
        if (!GameOverRef.current) {
          handleWrong();
        }
      }
    }, intervalTime);

    // cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [count, language]);

  return (
    <div className={styles.colorMatch_game}>
      {language === 0 && (
        <ColorMatchStart
          setLanguage={setLanguage}
          setCount={setCount}
          GameOverRef={GameOverRef}
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
    </div>
  );
};

const ColorMatchStart = ({ setLanguage, setCount, GameOverRef }) => {
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

            GameOverRef.current = false;
          }}
        >
          한국어
        </button>
        <button
          onClick={() => {
            setLanguage(2);
            setCount(0);
            GameOverRef.current = false;
          }}
        >
          English
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
  formatTime,
  match,
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
        <p className={styles.main_title}>글씨의 색을 선택하세요</p>
        <p className={styles.color_word} style={{ color: wordColor }}>
          {word}
        </p>
        <div className={styles.btn_zone}>
          {buttonList.map((i, index) => {
            return (
              <button
                className={styles.color_btn}
                key={"button-" + i + index}
                name={i}
                onClick={(e) => {
                  console.log(e.target.name);
                  match(i);
                }}
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default ColorMatch;
