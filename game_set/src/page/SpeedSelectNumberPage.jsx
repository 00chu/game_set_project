import SpeedSelectNumber from "../component/game/SpeedSelectNumber";
import styles from "./page.module.css";

const SpeedSelectNumberPage = () => {
  return (
    <div className={styles.page}>
      <h2>Speed Test</h2>
      <SpeedSelectNumber />
    </div>
  );
};

export default SpeedSelectNumberPage;
