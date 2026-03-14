import { Link } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">🎮CodeArcade🎮</Link>
            </div>
            <div className={styles.nav}>
                <Link to="/baseBall">⚾BASEBALL⚾</Link>
                <p>|</p>
            </div>
        </header>
    );
}
export default Header;