import BaseBall from "../../component/game/BaseBall";
import styles from "./page.module.css";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";

const BaseBallPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.gameHero}>
        <h1>
          <SportsBaseballIcon
            sx={{
              fontSize: 60,
              color: "var(--accent)",
            }}
          />
          NUMBER BASEBALL
        </h1>
        <p>Guess the hidden 4-digit number</p>
      </div>
      <BaseBall />
    </div>
  );
};

export default BaseBallPage;
