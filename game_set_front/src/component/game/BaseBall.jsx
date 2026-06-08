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

  return (
    <div className={styles.baseball_game}>
      <BaseBallScore scores={scores} />
      <BaseBallInput
        throwBall={throwBall}
        setThrowBall={setThrowBall}
        result={result}
        selectNum={selectNum}
        setSelectNum={setSelectNum}
      />
    </div>
  );
};

const BaseBallScore = ({ scores }) => {
  return (
    <div className={styles.baseball_score}>
      <h3>기록</h3>
      {scores.map((score, i) => {
        return (
          <div key={"base-" + i}>
            <ul>
              <li>{i + 1}</li>
              <li>{score.number}</li>
              <li>{score.strikeCount}S</li>
              <li>{score.ballCount}B</li>
            </ul>
            <hr></hr>
          </div>
        );
      })}
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
          onClick={(e) => {
            setSelectNum(e.target.name);
          }}
        >
          {throwBall.one}
        </button>
        <button
          className={styles.baseball_input}
          name="two"
          onClick={(e) => setSelectNum(e.target.name)}
        >
          {throwBall.two}
        </button>
        <button
          className={styles.baseball_input}
          name="three"
          onClick={(e) => setSelectNum(e.target.name)}
        >
          {throwBall.three}
        </button>
        <button
          className={styles.baseball_input}
          name="four"
          onClick={(e) => setSelectNum(e.target.name)}
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

export default BaseBall;
