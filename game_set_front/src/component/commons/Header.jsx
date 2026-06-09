import { Link } from "react-router-dom";
import styles from "./commons.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        🎮 CodeArcade
      </Link>

      <Link to="/login" className={styles.badge}>
        Log In
      </Link>
    </header>
  );
};

export default Header;
