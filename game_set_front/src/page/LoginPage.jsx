import { Link } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>🎮</div>

        <h1>CodeArcade</h1>

        <p className={styles.description}>
          Login to save your records and rankings
        </p>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" />
          </div>

          <button type="submit" className={styles.loginBtn}>
            LOGIN
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/signup">회원가입</Link>
          <Link to="/find-account">아이디 / 비밀번호 찾기</Link>
        </div>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div className={styles.socials}>
          <button className={styles.google}>G</button>
          <button className={styles.kakao}>K</button>
          <button className={styles.apple}>A</button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
