import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AuthPage.module.css";

const FindAccountPage = () => {
  const [step, setStep] = useState(1);

  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <div className={styles.logo}>🔒</div>

        <h1>Reset Password</h1>

        <p className={styles.description}>
          이메일 인증 후 새 비밀번호를 설정하세요.
        </p>

        <div className={styles.steps}>
          <span className={step >= 1 ? styles.active : ""}>1</span>
          <span className={step >= 2 ? styles.active : ""}>2</span>
          <span className={step >= 3 ? styles.active : ""}>3</span>
        </div>

        {step === 1 && (
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>이메일</label>

              <input type="email" placeholder="가입한 이메일을 입력하세요" />
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setStep(2)}
            >
              인증번호 보내기
            </button>
          </form>
        )}

        {step === 2 && (
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>인증번호</label>

              <input type="text" placeholder="인증번호를 입력하세요" />
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setStep(3)}
            >
              인증하기
            </button>
          </form>
        )}

        {step === 3 && (
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>새 비밀번호</label>

              <input type="password" placeholder="새 비밀번호를 입력하세요" />
            </div>

            <div className={styles.inputGroup}>
              <label>비밀번호 확인</label>

              <input type="password" placeholder="비밀번호를 다시 입력하세요" />
            </div>

            <button type="submit" className={styles.primaryBtn}>
              비밀번호 변경
            </button>
          </form>
        )}

        <div className={styles.bottomLink}>
          로그인 화면으로
          <Link to="/login"> 이동</Link>
        </div>
      </div>
    </main>
  );
};

export default FindAccountPage;
