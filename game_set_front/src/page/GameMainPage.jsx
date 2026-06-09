import { Link } from "react-router-dom";
import styles from "./GameMainPage.module.css";

const GameMainPage = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>CodeArcade</h1>

        <p>React 기반 미니게임 프로젝트</p>
      </section>

      <section className={styles.games}>
        <Link to="/baseBall" className={styles.card}>
          <div className={styles.icon}>⚾</div>

          <h3>Number Baseball</h3>

          <p>숫자를 추리하며 정답을 맞추는 게임</p>

          <span>PLAY GAME →</span>
        </Link>

        <Link to="/colorMatch" className={styles.card}>
          <div className={styles.icon}>🎨</div>

          <h3>Color Match</h3>

          <p>기억력과 반응속도를 테스트하는 게임</p>

          <span>PLAY GAME →</span>
        </Link>
      </section>
    </div>
  );
};

export default GameMainPage;
