import { useEffect, useState } from "react";
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
  const [count, setCount] = useState();
  const [time, setTime] = useState(0);
  const [over, setOver] = useState(false);

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
    //한국어일때 영어일때
    if (language === 1) {
      if (colorEng.indexOf(wordColor) === colorKor.indexOf(i)) {
        setCount(count + 1);
      } else {
        handleWrong();
      }
    } else {
      if (i === wordColor) {
        setCount(count + 1);
      } else {
        handleWrong();
      }
    }
  };

  const handleWrong = async () => {
    setOver(true);

    const result = await Swal.fire({
      title: "Game Over",
      icon: "error",
      text: `Correct: ${count}, time: ${parseInt(time / 60)}:${time % 60}`,
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
  }, [time, over]);

  return (
    <div className={styles.colorMatch_game}>
      {language === 0 && (
        <ColorMatchStart setLanguage={setLanguage} setCount={setCount} />
      )}
      {language !== 0 && (
        <ColorMatchMain
          count={count}
          time={time}
          word={word}
          wordColor={wordColor}
          buttonList={buttonList}
          match={match}
        />
      )}
    </div>
  );
};

const ColorMatchStart = ({ setLanguage, setCount }) => {
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
          }}
        >
          한국어
        </button>
        <button
          onClick={() => {
            setLanguage(2);
            setCount(0);
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
  match,
}) => {
  return (
    <main>
      <div className={styles.progress}>
        <p>count: {count}</p>
        <p>
          time: {parseInt(time / 60)}:{time % 60}
        </p>
      </div>
      <div className={styles.word_zone}>
        <p className={styles.main_title}>글씨의 색을 선택하세요</p>
        <p className={styles.color_word} style={{ color: wordColor }}>
          {word}
        </p>
        <div className={styles.btn_zone}>
          {buttonList.map((i) => {
            return (
              <button
                className={styles.color_btn}
                key={"button-" + i}
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
