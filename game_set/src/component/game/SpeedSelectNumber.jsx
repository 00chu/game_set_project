import { useState } from "react";
import styles from "./SpeedSelectNumber.module.css";

const SpeedSelectNumber = () => {
  const [start, setStart] = useState(false);
  const [number, setNumber] = useState(25);

  return start ? (
    <SpeedSelectNumberStart
      start={start}
      setStart={setStart}
      number={number}
      setNumber={setNumber}
    />
  ) : (
    <SpeedSelectNumberStart />
  );
};

const SpeedSelectNumberStart = ({ number, setNumber, setStart }) => {
  return (
    <div>
      <h1>Speed Test</h1>
      <input
        type="number"
        name="number"
        id="number"
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);
        }}
      ></input>
      <div className={styles.number_button_wrap}>
        <button
          type="button"
          className={styles.button_up}
          onClick={setNumber((prev) => {
            prev + 1;
          })}
        >
          ▲
        </button>
        <button
          type="button"
          className={styles.button_down}
          onClick={setNumber((prev) => {
            prev - 1;
          })}
        >
          ▼
        </button>
      </div>
      <button
        type="button"
        className={styles.button_start}
        onClick={setStart(true)}
      >
        start
      </button>
    </div>
  );
};

export default SpeedSelectNumber;
