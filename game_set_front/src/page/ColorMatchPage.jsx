import ColorMatch from "../component/game/ColorMatch";
import styles from "./page.module.css";

const ColorMatchPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.gameHero}>
        <h1>🎨 COLOR MATCH</h1>
        <p>Choose the color of the text</p>
      </div>

      <ColorMatch />
    </div>
  );
};

export default ColorMatchPage;
