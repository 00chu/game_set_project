import { Link } from "react-router-dom";
import styles from "./AuthPage.module.css";

const SignupPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <div className={styles.logo}>🎮</div>

        <h1>Create Account</h1>

        <p className={styles.description}>
          CodeArcade와 함께 게임 기록을 관리해보세요.
        </p>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>닉네임</label>
            <input type="text" placeholder="닉네임을 입력하세요" />
          </div>

          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input type="email" placeholder="이메일을 입력하세요" />
          </div>

          <div className={styles.inputGroup}>
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요" />
          </div>

          <div className={styles.inputGroup}>
            <label>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호를 다시 입력하세요" />
          </div>

          <button type="submit" className={styles.primaryBtn}>
            회원가입
          </button>
        </form>

        <div className={styles.bottomLink}>
          이미 계정이 있으신가요?
          <Link to="/login"> 로그인</Link>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
