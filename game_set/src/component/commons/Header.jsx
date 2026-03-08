import { Link } from "react-router-dom";
import styles from "./header.module.css";

const Header = ()=>{
    return(
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">🎮GAME🎮</Link>
            </div>
            <div className={styles.nav}>
                <Link to="/baseBall">⚾BASEBALL⚾</Link>  |
            </div>
        </header>
    );
}
export default Header;