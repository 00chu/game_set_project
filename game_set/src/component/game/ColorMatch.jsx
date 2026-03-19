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

  const [language, setLanguage] = useState();

  const [word, setWord] = useState();
  const [wordColor, setWordColor] = useState();
  const [buttonList, setButtonList] = useState([]);

  const [count, setCount] = useState();

  const shuffle = (arr) => {
    return Math.random() > 0.5 ? arr : [arr[1], arr[0]];
  };

  const match = (i) => {
    //한국어일때 영어일때로나눠서
    if (colorEng.indexOf(wordColor) === colorKor.indexOf(i)) {
      console.log(2);
      setCount(count + 1);
    } else {
      return Swal.fire({
        title: "Wrong!",
        text: "",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#6D28D9",
        cancelButtonColor: "rgb(0, 0, 0)",
        confirmButtonText: "REPLAY",
        cancelButtonText: "HOME",
      }).then((result) => {
        if (result.value) {
          window.location.reload();
        }
        if (result.isDismissed) {
          navigate("/");
        }
      });
    }
  };

  useEffect(() => {
    if (language) {
      //한국어
      const randomWord = colorKor[Math.floor(Math.random() * colorKor.length)];
      while (true) {
        const randomColor =
          colorKor[Math.floor(Math.random() * colorKor.length)];
        if (randomWord !== randomColor) {
          const arr = [];
          arr.push(randomWord);
          arr.push(randomColor);

          setWord(randomWord);
          setWordColor(colorEng[colorKor.indexOf(randomColor)]);
          setButtonList(shuffle(arr));
          break;
        }
      }
    } else {
      //영어
      const randomWord = colorEng[Math.floor(Math.random() * colorEng.length)];
      const randomColor = colorEng[Math.floor(Math.random() * colorEng.length)];

      const arr = [];
      arr.push(randomWord);
      arr.push(randomColor);

      setWord(randomWord);
      setWordColor(randomColor);
      setButtonList(arr);
    }
  }, [count]);

  return (
    <div className={styles.colorMatch_game}>
      {!language && (
        <ColorMatchStart setLanguage={setLanguage} setCount={setCount} />
      )}
      {language && (
        <ColorMatchMain
          count={count}
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
            setLanguage(true);
            setCount(0);
          }}
        >
          한국어
        </button>
        <button
          onClick={() => {
            setLanguage(false);
            setCount(0);
          }}
        >
          English
        </button>
      </div>
    </main>
  );
};

const ColorMatchMain = ({ count, word, wordColor, buttonList, match }) => {
  return (
    <main>
      <div className={styles.progress}>
        <p>count: {count}</p>
        <p>time: </p>
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
