import { useEffect, useState } from "react";
import styles from "./BaseBall.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BaseBall = () => {
  const navigate = useNavigate();

  const [answer, setAnswer] = useState([]);
  const [throwBall, setThrowBall] = useState({});
  const [scores, setScores] = useState([]);
  const [selectNum, setSelectNum] = useState("one");

  const result = () => {
    const myAnswer = Object.values(throwBall);
    let strike = 0;
    let ball = 0;
    for (let i = 0; i < 4; i++) {
      if (answer[i] === myAnswer[i]) {
        strike++;
      } else {
        if (answer.includes(myAnswer[i])) {
          ball++;
        }
      }
    }

    if (strike === 4) {
      return Swal.fire({
        title: "Correct!",
        text: "answer: " + answer.join("") + " , " + scores.length + " Times",
        icon: "success",
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

    setScores((scores) => [
      ...scores,
      { number: myAnswer.join(""), strikeCount: strike, ballCount: ball },
    ]);
    setThrowBall({});
    setSelectNum("one");
  };

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

  useEffect(() => {
    console.log(answer); // answer 값이 변경된 후 로그 출력
  }, [answer]);

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
    </div>
  );
};

const BaseBallScore = ({ scores }) => {
  return (
    <div className={styles.baseball_score}>
      <h3>기록</h3>

      <div className={styles.score_body}>
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

      <div className={styles.mobileHistory}>
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

export default BaseBall;
