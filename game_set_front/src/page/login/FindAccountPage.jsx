import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { findAccountSchema } from "../../component/auth/validation/authSchema.js";
import styles from "./AuthPage.module.css";

const FindAccountPage = () => {
  const [step, setStep] = useState(1);

  // STEP 1 - 이메일
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(findAccountSchema.pick(["email"])),
  });

  // STEP 2 - 인증번호
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm({
    resolver: yupResolver(findAccountSchema.pick(["code"])),
  });

  // STEP 3 - 비밀번호 변경
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(
      findAccountSchema.pick(["newPassword", "newPasswordConfirm"]),
    ),
  });

  // STEP 1 submit
  const onEmailSubmit = (data) => {
    console.log("이메일 전송:", data);
    setStep(2);
  };

  // STEP 2 submit
  const onCodeSubmit = (data) => {
    console.log("코드 확인:", data);
    setStep(3);
  };

  // STEP 3 submit
  const onPasswordSubmit = (data) => {
    console.log("비밀번호 변경:", data);
    alert("비밀번호 변경 완료!");
  };

  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <div className={styles.logo}>🔒</div>

        <h1>Reset Password</h1>

        <p className={styles.description}>
          이메일 인증 후 새 비밀번호를 설정하세요.
        </p>

        {/* STEP UI */}
        <div className={styles.steps}>
          <span className={step >= 1 ? styles.active : ""}>1</span>
          <span className={step >= 2 ? styles.active : ""}>2</span>
          <span className={step >= 3 ? styles.active : ""}>3</span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form
            className={styles.form}
            onSubmit={handleEmailSubmit(onEmailSubmit)}
          >
            <div className={styles.inputGroup}>
              <label>이메일</label>

              <input
                type="email"
                placeholder="가입한 이메일을 입력하세요"
                {...registerEmail("email")}
              />

              <p className={styles.error}>{emailErrors.email?.message}</p>
            </div>

            <button type="submit" className={styles.primaryBtn}>
              인증번호 보내기
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            className={styles.form}
            onSubmit={handleCodeSubmit(onCodeSubmit)}
          >
            <div className={styles.inputGroup}>
              <label>인증번호</label>

              <input
                type="text"
                placeholder="인증번호를 입력하세요"
                {...registerCode("code")}
              />

              <p className={styles.error}>{codeErrors.code?.message}</p>
            </div>

            <button type="submit" className={styles.primaryBtn}>
              인증하기
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form
            className={styles.form}
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          >
            <div className={styles.inputGroup}>
              <label>새 비밀번호</label>

              <input
                type="password"
                placeholder="새 비밀번호를 입력하세요"
                {...registerPassword("newPassword")}
              />

              <p className={styles.error}>
                {passwordErrors.newPassword?.message}
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label>비밀번호 확인</label>

              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                {...registerPassword("newPasswordConfirm")}
              />

              <p className={styles.error}>
                {passwordErrors.newPasswordConfirm?.message}
              </p>
            </div>

            <button type="submit" className={styles.primaryBtn}>
              비밀번호 변경
            </button>
          </form>
        )}

        <div className={styles.bottomLink}>
          로그인 화면으로 <Link to="/login">이동</Link>
        </div>
      </div>
    </main>
  );
};

export default FindAccountPage;
