import { Link } from "react-router-dom";
import styles from "./commons.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        🎮 CodeArcade
      </Link>

      <span className={styles.badge}>React Mini Games</span>
    </header>
  );
};

export default Header;
