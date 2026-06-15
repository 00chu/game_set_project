import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "./signupSchema";
import { Link } from "react-router-dom";
import styles from "./AuthPage.module.css";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      isEmailVerified: false, // 초기값 이메일 인증 false
    },
  });

  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const email = watch("email");

  // 인증번호 전송
  const sendCode = async () => {
    console.log("인증번호 전송:", email);

    // TODO API
    setCodeSent(true);
  };

  // 인증 확인
  const verifyCode = () => {
    console.log("인증 성공");

    setVerified(true);

    // RHF 폼 데이터 안에 인증 성공 남김
    setValue("isEmailVerified", true);
  };

  const onSubmit = (data) => {
    if (!verified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    console.log("회원가입 데이터:", data);
  };

  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <div className={styles.logo}>🎮</div>

        <h1>Create Account</h1>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* 닉네임 */}
          <div className={styles.inputGroup}>
            <label>닉네임</label>
            <input {...register("nickname")} />
            <p className={styles.error}>{errors.nickname?.message}</p>
          </div>

          {/* 이메일 */}
          <div className={styles.inputGroup}>
            <label>이메일</label>

            <div className={styles.emailRow}>
              <input {...register("email")} />

              <button type="button" onClick={sendCode}>
                인증번호 전송
              </button>
            </div>

            <p className={styles.error}>{errors.email?.message}</p>
          </div>

          {/* 인증번호 */}
          {codeSent && (
            <div className={styles.inputGroup}>
              <label>인증번호</label>

              <div className={styles.emailRow}>
                <input value={code} onChange={(e) => setCode(e.target.value)} />

                <button type="button" onClick={verifyCode}>
                  인증 확인
                </button>
              </div>
            </div>
          )}

          {verified && <p className={styles.success}>이메일 인증 완료 ✅</p>}

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label>비밀번호</label>
            <input type="password" {...register("password")} />
            <p className={styles.error}>{errors.password?.message}</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.inputGroup}>
            <label>비밀번호 확인</label>
            <input type="password" {...register("passwordConfirm")} />
            <p className={styles.error}>{errors.passwordConfirm?.message}</p>
          </div>

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={!verified}
          >
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
