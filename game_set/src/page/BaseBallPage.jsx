import BaseBall from "../component/game/BaseBall";
import styles from "./page.module.css";

const BaseBallPage = ()=>{
    return(
        <div className={styles.page}>
            <h2>BASEBALL GAME</h2>
            <BaseBall></BaseBall>
        </div>
    )
}

export default BaseBallPage;