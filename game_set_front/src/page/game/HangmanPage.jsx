import Hangman from "../../component/game/hangman/Hangman";
import styles from "./page.module.css";
import PsychologyIcon from "@mui/icons-material/Psychology";

const HangmanPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.gameHero}>
        <h1>
          <PsychologyIcon
            sx={{
              fontSize: 60,
              color: "var(--accent)",
            }}
          />
          HANGMAN
        </h1>

        <p>Guess the hidden English word</p>
      </div>

      <Hangman />
    </div>
  );
};

export default HangmanPage;
