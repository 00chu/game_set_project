import ColorMatch from "../component/game/ColorMatch";
import styles from "./page.module.css";

const ColorMatchPage = () => {
  return (
    <div className={styles.colorMatch_page}>
      <h2>colormatch game</h2>
      <ColorMatch />
    </div>
  );
};

export default ColorMatchPage;
