import { useEffect, useState } from "react";
import styles from "./SpeedSelectNumber.module.css";

const SpeedSelectNumber = () => {
  const [start, setStart] = useState(false);
  const [num, setNum] = useState(10);
  const [list, setList] = useState([]);

  useEffect(() => {
    const numList = Array.from({ length: num }, (_, i) => i + 1).sort(
      () => Math.random() - 0.5,
    );

    setList(numList);
  }, [start]);

  return !start ? (
    <SpeedSelectNumberStart
      start={start}
      setStart={setStart}
      num={num}
      setNum={setNum}
    />
  ) : (
    <SpeedSelectNumberGame list={list} />
  );
};

const SpeedSelectNumberStart = ({ num, setNum, setStart }) => {
  return (
    <div className={styles.speed_game}>
      <h1 className={styles.speed_game_title}>Choose a number</h1>
      <div className={styles.input_number}>
        <input
          type="number"
          name="number"
          id="number"
          value={num}
          readOnly={true}
          onChange={(e) => {
            setNum(e.target.value);
          }}
        ></input>
        <div className={styles.number_button_wrap}>
          <button
            type="button"
            className={styles.button_up}
            onClick={() => setNum((prev) => Math.min(100, prev + 10))}
          >
            ▲
          </button>
          <button
            type="button"
            className={styles.button_down}
            onClick={() => setNum((prev) => Math.max(10, prev - 10))}
          >
            ▼
          </button>
        </div>
      </div>
      <button
        type="button"
        className={styles.button_start}
        onClick={() => setStart(true)}
      >
        start
      </button>
    </div>
  );
};

const SpeedSelectNumberGame = ({ list }) => {
  return (
    <div className={styles.speed_game}>
      <h1 className={styles.speed_game_title}>Click the numbers in order</h1>
      <div className={styles.button_list_wrap}>
        {list.map((n) => (
          <button key={"button" + n}>{n}</button>
        ))}
      </div>
    </div>
  );
};

export default SpeedSelectNumber;
