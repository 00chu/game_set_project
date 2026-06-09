import BaseBall from "../component/game/BaseBall";
import styles from "./page.module.css";

const BaseBallPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.gameHero}>
        <h1>⚾ NUMBER BASEBALL</h1>
        <p>Guess the hidden 4-digit number</p>
      </div>
      <BaseBall />
    </div>
  );
};

export default BaseBallPage;
