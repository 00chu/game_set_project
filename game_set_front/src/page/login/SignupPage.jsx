import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../component/auth/validation/authSchema.js";
import {
  signupApi,
  sendEmailApi,
  checkEmailApi,
} from "../../component/auth/api.js";
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
  const [time, setTime] = useState(0);

  const sendCode = async () => {
    const isValid = await trigger("email");

    if (!isValid) {
      return;
    }

    try {
      // 서버에 이메일 인증 요청
      const response = await sendEmailApi(email);

      // 서버가 보내준 만료 시간
      const expiredTime = new Date(response.expiredAt);

      // 현재 시간과 남은 시간 계산 (초)
      const remainTime = Math.floor(
        (expiredTime.getTime() - Date.now()) / 1000,
      );

      // 인증 입력창 표시
      setCodeSent(true);

      // 기존 인증번호 초기화
      setValue("code", "");

      // 이메일 인증 상태 초기화
      setValue("isEmailVerified", false);

      // 타이머 시작
      setTime(remainTime);

      console.log(response.message);
    } catch (error) {
      console.error("전송 실패", error);
    }
  };

  useEffect(() => {
    if (time <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatTime = () => {
    const minute = String(Math.floor(time / 60)).padStart(2, "0");
    const second = String(time % 60).padStart(2, "0");

    return `${minute}:${second}`;
  };

  // 인증 확인
  const verifyCode = async () => {
    if (time <= 0) {
      alert("인증 시간이 만료되었습니다. 다시 인증해주세요.");
      return;
    }

    try {
      await checkEmailApi({
        email,
        code,
      });

      setValue("isEmailVerified", true, {
        shouldValidate: true,
      });

      clearErrors("code");

      console.log("인증 성공");
    } catch (error) {
      setError("code", {
        type: "manual",
        message: "인증번호가 올바르지 않습니다.",
      });
    }
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
              {!isEmailVerified && codeSent && <p>남은 시간: {formatTime()}</p>}
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
