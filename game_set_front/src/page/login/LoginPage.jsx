import { Link } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>🎮</div>

        <h1>CodeArcade</h1>

        <p className={styles.description}>
          게임 기록과 랭킹을 저장하고 관리해보세요.
        </p>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input type="email" placeholder="이메일을 입력하세요" />
          </div>

          <div className={styles.inputGroup}>
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요" />
          </div>

          <button type="submit" className={styles.loginBtn}>
            로그인
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/signup">회원가입</Link>
          <Link to="/find-account">비밀번호 찾기</Link>
        </div>

        <div className={styles.divider}>
          <span>또는</span>
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
