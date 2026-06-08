import { Link } from "react-router-dom";
import styles from "./commons.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">🎮CodeArcade🎮</Link>
      </div>
      <div className={styles.nav}></div>
    </header>
  );
};
export default Header;
