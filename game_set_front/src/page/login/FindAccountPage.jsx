import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { findAccountSchema } from "../../component/auth/validation/authSchema.js";
import styles from "./FindAccountPage.module.css";
import {
  changePassword,
  checkEmailApi,
  sendEmailResetApi,
} from "../../component/auth/api.js";
import { useCountdownTimer } from "../../component/hooks/useCountdownTimer.js";
import PasswordInput from "../../component/ui/PasswordInput.jsx";

const FindAccountPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // 1 - 이메일
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(findAccountSchema.pick(["email"])),
  });

  // 2 - 인증번호
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(findAccountSchema.pick(["code"])),
  });

  // 3 - 비밀번호 변경
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(
      // 이 폼에서는 두 개의 필드만 yup으로 검사함. step별로 form validation 분리
      findAccountSchema.pick(["newPassword", "newPasswordConfirm"]),
    ),
  });

  const { time, startTimer, formatTime } = useCountdownTimer();
  const [emailData, setEmailData] = useState(null);
  const [codeData, setCodeData] = useState(null);
  const onEmailSubmit = async (data) => {
    setEmailData(data.email);
    const response = await sendEmailResetApi(data.email);
    startTimer(response.expiredAt);
    setStep(2);
  };

  const onCodeSubmit = async (data) => {
    if (time <= 0) {
      setError("email", {
        type: "manual",
        message: "인증 시간이 만료되어 다시 인증해주세요.",
      });

      setStep(1);
      setEmailData(null);
      return;
    }

    try {
      setCodeData(data.code);

      await checkEmailApi({
        email: emailData,
        code: data.code,
      });

      clearErrors("code");
      setStep(3);
    } catch (error) {
      setError("code", {
        type: "manual",
        message: error.response?.data || "인증번호가 올바르지 않습니다.",
      });
    }
  };

  const onPasswordSubmit = async (data) => {
    await changePassword({
      email: emailData,
      code: codeData,
      newPassword: data.newPassword,
    });

    alert("비밀번호 변경 완료!");
    navigate("/login", { replace: true });
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
              {time > 0 && <p>남은 시간: {formatTime()}</p>}
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

              <PasswordInput
                register={registerPassword}
                name="newPassword"
                placeholder="새 비밀번호"
              />

              <p className={styles.error}>
                {passwordErrors.newPassword?.message}
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label>비밀번호 확인</label>

              <PasswordInput
                register={registerPassword}
                name="newPasswordConfirm"
                placeholder="비밀번호 확인"
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
