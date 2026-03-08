import { useEffect, useState } from "react";
import styles from "./baseBall.module.css";

const BaseBall = () => {
  const answer = [];
  const answers = () => {
    for (let i = 0; i < 4; i++) {
      answer.push(parseInt(Math.random() * 9));
      console.log(1);
    }
  };

  useEffect(() => {
    answers;
    console.log(answer);
  }, []);

  const [throwBall, setThrowBall] = useState({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
  });
  const [scores, setScores] = useState([
    {
      ballCount: "",
      strikeCount: "",
    },
  ]);

  const inputNum = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newThrowBall = { ...throwBall, [name]: value };
    setThrowBall(newThrowBall);
  };

  const result = () => {
    const myAnswer = [{ ...throwBall }];
    for (let i = 0; i < 4; i++) {
      if (answer[i] == myAnswer[i]) {
        setScores(scores.strikeCount + 1);
      }
    }
  };

  return (
    <div className={styles.baseball_game}>
      <div className={styles.baseball_score}>
        <h3>기록</h3>
        <hr></hr>
        {scores.map((score, i) => {
          return (
            <div>
              <ul key={"base-" + i}>
                <li>{i + 1}</li>
                <li>{score.ballCount}B</li>
                <li>{score.strikeCount}S</li>
              </ul>
              <hr></hr>
            </div>
          );
        })}
      </div>
      <div className={styles.baseball_board}>
        <div className={styles.baseBall_inputs}>
          <div className={styles.baseball_input}>
            <input
              type="number"
              name="one"
              id="one"
              onChange={inputNum}
              value={throwBall.one}
              min={0}
              max={9}
            ></input>
          </div>
          <div className={styles.baseball_input}>
            <input
              type="number"
              name="two"
              id="two"
              onChange={inputNum}
              value={throwBall.two}
              min={0}
              max={9}
            ></input>
          </div>
          <div className={styles.baseball_input}>
            <input
              type="number"
              name="three"
              id="three"
              onChange={inputNum}
              value={throwBall.three}
              min={0}
              max={9}
            ></input>
          </div>
          <div className={styles.baseball_input}>
            <input
              type="number"
              name="four"
              id="four"
              onChange={inputNum}
              value={throwBall.four}
              min={0}
              max={9}
            ></input>
          </div>
        </div>
        <div className={styles.btn}>
          <button onClick={result}>THROW</button>
        </div>
      </div>
    </div>
  );
};

export default BaseBall;
