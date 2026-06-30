import { useEffect, useRef, useState } from "react";
import styles from "./BaseBall.module.css";
import { useNavigate } from "react-router-dom";
import { saveRecordApi } from "./api";

const BaseBall = () => {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);

  const [answer, setAnswer] = useState([]);
  const [throwBall, setThrowBall] = useState({});
  const [scores, setScores] = useState([]);
  const [selectNum, setSelectNum] = useState("one");

  const [isGameOver, setIsGameOver] = useState(false);

  // 정답 판단
  const result = async () => {
    const myAnswer = Object.values(throwBall);

    let strike = 0;
    let ball = 0;

    for (let i = 0; i < 4; i++) {
      if (answer[i] === myAnswer[i]) {
        strike++;
      } else if (answer.includes(myAnswer[i])) {
        ball++;
      }
    }

    const tryCount = scores.length + 1;

    if (strike === 4) {
      setIsGameOver(true);

      // 여기서 저장
      try {
        await saveRecordApi({
          gameName: "BASEBALL",
          score: tryCount,
        });
      } catch (e) {
        console.error(e);
      }

      return;
    }

    setScores((scores) => [
      ...scores,
      {
        number: myAnswer.join(""),
        strikeCount: strike,
        ballCount: ball,
      },
    ]);

    setThrowBall({});
    setSelectNum("one");
  };

  // 정답 생성
  useEffect(() => {
    const arr = [];
    while (arr.length < 4) {
      const num = Math.floor(Math.random() * 10);
      if (!arr.includes(num)) {
        arr.push(num);
      }
    }
    setAnswer(arr);
  }, []);

  // 768보다 작을 때 모바일 UI 사용
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!started) {
    return (
      <div className={styles.startContainer}>
        <BaseBallStart
          onStart={() => setStarted(true)}
          onRanking={() => navigate("/history/BASEBALL")}
        />
      </div>
    );
  }

  return (
    <div className={styles.baseball_game}>
      {!isMobile && <BaseBallScore scores={scores} />}

      {isMobile ? (
        <MobileBaseBallInput
          throwBall={throwBall}
          setThrowBall={setThrowBall}
          result={result}
          scores={scores}
        />
      ) : (
        <BaseBallInput
          throwBall={throwBall}
          setThrowBall={setThrowBall}
          result={result}
          selectNum={selectNum}
          setSelectNum={setSelectNum}
        />
      )}

      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverCard}>
            <h1>HOME RUN</h1>

            <p>정답: {answer.join("")}</p>
            <p>시도 횟수: {scores.length + 1}</p>

            <div className={styles.btnRow}>
              <button
                onClick={() => {
                  window.location.reload();
                }}
              >
                REPLAY
              </button>
              <button onClick={() => navigate("/history/BASEBALL")}>
                RANKING
              </button>
              <button
                onClick={() => {
                  navigate("/");
                }}
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BaseBallScore = ({ scores }) => {
  const scoreRef = useRef(null);

  useEffect(() => {
    if (scoreRef.current) {
      scoreRef.current.scrollTop = scoreRef.current.scrollHeight;
    }
  }, [scores]);

  return (
    <div className={styles.baseball_score}>
      <h3>기록</h3>

      <div className={styles.score_body} ref={scoreRef}>
        {scores.map((score, i) => {
          return (
            <div key={"base-" + i}>
              <ul>
                <li>{i + 1}</li>
                <li>{score.number}</li>
                <li>{score.strikeCount}S</li>
                <li>{score.ballCount}B</li>
              </ul>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BaseBallInput = ({
  throwBall,
  setThrowBall,
  result,
  selectNum,
  setSelectNum,
}) => {
  const arr = Array.from({ length: 10 }, (_, i) => i);

  const clearInput = (name) => {
    setThrowBall((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    setSelectNum(name);
  };

  const btnClick = (i) => {
    setThrowBall({ ...throwBall, [selectNum]: i });
    if (selectNum === "one") setSelectNum("two");
    else if (selectNum === "two") setSelectNum("three");
    else if (selectNum === "three") setSelectNum("four");
  };

  return (
    <div className={styles.baseball_board}>
      <div className={styles.baseBall_inputs}>
        <button
          className={styles.baseball_input}
          name="one"
          onClick={() => clearInput("one")}
        >
          {throwBall.one}
        </button>
        <button
          className={styles.baseball_input}
          name="two"
          onClick={() => clearInput("two")}
        >
          {throwBall.two}
        </button>

        <button
          className={styles.baseball_input}
          name="three"
          onClick={() => clearInput("three")}
        >
          {throwBall.three}
        </button>

        <button
          className={styles.baseball_input}
          name="four"
          onClick={() => clearInput("four")}
        >
          {throwBall.four}
        </button>
      </div>
      <div className={styles.input_btn_zone}>
        <h1>{selectNum}</h1>
        <div className={styles.input_buttons}>
          {arr.map((i) => (
            <button
              className={
                Object.values(throwBall).includes(i)
                  ? styles.input_button_already
                  : styles.input_button
              }
              key={"button-" + i}
              onClick={() => {
                btnClick(i);
              }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.btn}>
        <button onClick={result} disabled={Object.keys(throwBall).length < 4}>
          THROW
        </button>
      </div>
    </div>
  );
};

const MobileBaseBallInput = ({ throwBall, setThrowBall, result, scores }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (e) => {
    const num = e.nativeEvent.data;

    if (!num || /\D/.test(num)) return;

    if (Object.values(throwBall).includes(Number(num))) {
      return;
    }

    const obj = { ...throwBall };

    if (selectedIndex === 0) obj.one = Number(num);
    if (selectedIndex === 1) obj.two = Number(num);
    if (selectedIndex === 2) obj.three = Number(num);
    if (selectedIndex === 3) obj.four = Number(num);

    setThrowBall(obj);

    if (selectedIndex < 3) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const removeDigit = (index) => {
    const obj = { ...throwBall };

    if (index === 0) delete obj.one;
    if (index === 1) delete obj.two;
    if (index === 2) delete obj.three;
    if (index === 3) delete obj.four;

    setThrowBall(obj);
    setSelectedIndex(index);
  };

  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [scores]);

  return (
    <div className={styles.mobileGame}>
      <h1 className={styles.mobileTitle}>Baseball</h1>

      <label>
        <input
          className={styles.hiddenInput}
          type="tel"
          inputMode="numeric"
          onChange={handleChange}
          value=""
        />

        <div className={styles.mobileNumberBoxes}>
          <div onClick={() => removeDigit(0)}>{throwBall.one ?? ""}</div>
          <div onClick={() => removeDigit(1)}>{throwBall.two ?? ""}</div>
          <div onClick={() => removeDigit(2)}>{throwBall.three ?? ""}</div>
          <div onClick={() => removeDigit(3)}>{throwBall.four ?? ""}</div>
        </div>
      </label>

      <button
        className={styles.mobileThrow}
        onClick={() => {
          result();

          setThrowBall({});
          setSelectedIndex(0);
        }}
        disabled={Object.keys(throwBall).length !== 4}
      >
        THROW
      </button>

      <div className={styles.mobileHistory} ref={historyRef}>
        <div className={styles.mobileHistoryHeader}>기록</div>

        {scores.map((score, i) => (
          <div key={i} className={styles.mobileHistoryItem}>
            <span>{score.number}</span>

            <span>
              {score.strikeCount} S {score.ballCount} B
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BaseBallStart = ({ onStart, onRanking }) => {
  return (
    <div className={styles.startScreen}>
      <h1 className={styles.startTitle}>⚾ BASEBALL</h1>

      <div className={styles.startButtons}>
        <button onClick={onStart}>START</button>
        <button onClick={onRanking}>RANKING</button>
      </div>
    </div>
  );
};

export default BaseBall;
