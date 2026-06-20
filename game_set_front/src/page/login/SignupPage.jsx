import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../component/auth/validation/authSchema.js";
import { signupApi } from "../../component/auth/api.js";
import { Link } from "react-router-dom";
import styles from "./AuthPage.module.css";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: "",
      code: "",
      isEmailVerified: false,
      nickname: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onChange", //재검증
  });

  const email = watch("email");
  const isEmailVerified = watch("isEmailVerified");
  const code = watch("code");

  const [codeSent, setCodeSent] = useState(false);

  const sendCode = async () => {
    const isValid = await trigger("email");

    if (!isValid) {
      return;
    }

    console.log("인증번호 전송:", email);

    setCodeSent(true);
  };

  // 인증 확인
  const verifyCode = () => {
    console.log("인증 성공");

    setValue("isEmailVerified", true, {
      shouldValidate: true,
    });
  };

  // 회원가입 submit
  const onSubmit = async (data) => {
    try {
      const response = await signupApi(data);

      console.log("회원가입 성공", response);
    } catch (error) {
      console.error("회원가입 실패", error);
    }
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
                <input {...register("code")} />

                <button type="button" onClick={verifyCode}>
                  인증 확인
                </button>
              </div>

              <p className={styles.error}>{errors.code?.message}</p>
            </div>
          )}

          {/* 인증 성공 */}
          {isEmailVerified && (
            <p className={styles.success}>이메일 인증 완료</p>
          )}

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
