import ColorMatch from "../../component/game/ColorMatch";
import styles from "./page.module.css";
import PaletteIcon from "@mui/icons-material/Palette";

const ColorMatchPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.gameHero}>
        <h1>
          <PaletteIcon
            sx={{
              fontSize: 60,
              color: "var(--accent)",
            }}
          />{" "}
          COLOR MATCH
        </h1>
        <p>Choose the color of the text</p>
      </div>

      <ColorMatch />
    </div>
  );
};

export default ColorMatchPage;
