import { Link } from "react-router-dom";
import styles from "./page.module.css";

const GameMainPage = () => {
  return (
    <div className={styles.page}>
      <h2>🎮game list🎮</h2>
      <ul className={styles.games}>
        <ul>
          <Link to="/baseball">
            <li>⚾ baseball ⚾</li>
          </Link>
          <Link to="/color-match">
            <li>✅ color match ✅</li>
          </Link>
          <Link to="/speed-test">
            <li>💨 speed test 💨</li>
          </Link>
        </ul>
      </ul>
    </div>
  );
};
export default GameMainPage;
