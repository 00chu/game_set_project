import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../component/auth/validation/authSchema.js";
import {
  signupApi,
  sendEmailApi,
  checkEmailApi,
} from "../../component/auth/api.js";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";
import { useCountdownTimer } from "../../component/hooks/useCountdownTimer.js";
import PasswordInput from "../../component/ui/PasswordInput.jsx";

const SignupPage = () => {
  const navigate = useNavigate();

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
      profileImage: null,
    },
    mode: "onChange", //재검증
  });

  const email = watch("email");
  const isEmailVerified = watch("isEmailVerified");
  const code = watch("code");

  const [codeSent, setCodeSent] = useState(false);
  const [preview, setPreview] = useState(null);

  const { time, startTimer, formatTime } = useCountdownTimer();

  const sendCode = async () => {
    const isValid = await trigger("email");

    if (!isValid) {
      return;
    }

    try {
      // 서버에 이메일 인증 요청
      const response = await sendEmailApi(email);

      startTimer(response.expiredAt);

      // 인증 입력창 표시
      setCodeSent(true);

      // 기존 인증번호 초기화
      setValue("code", "");

      // 이메일 인증 상태 초기화
      setValue("isEmailVerified", false);
    } catch (error) {
      setError("email", {
        type: "manual",
        message: error.response?.data || "이메일 전송 실패",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    setValue("profileImage", file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
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
      const formData = new FormData(); // 이미지는 JSON으로 올릴 수 없어 FormData로 전송

      formData.append("nickname", data.nickname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("passwordConfirm", data.passwordConfirm);

      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await signupApi(formData);

      // 가입 완료 후 로그인 페이지로 이동, 뒤로 가기 방지
      navigate("/login", { replace: true });
    } catch (error) {
      setError("nickname", {
        type: "manual",
        message: error.response?.data,
      });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <div className={styles.logo}>🎮</div>

        <h1>Create Account</h1>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* 프로필 이미지 */}
          <div className={styles.profileBox}>
            <img
              src={preview || "default-profile.png"}
              alt="프로필 미리보기"
              className={styles.profilePreview}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </div>

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
              {time > 0 && !isEmailVerified && <p>남은 시간: {formatTime()}</p>}
            </div>
          )}

          {/* 인증 성공 */}
          {isEmailVerified && (
            <p className={styles.success}>이메일 인증 완료</p>
          )}

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label>비밀번호</label>
            <PasswordInput
              register={register}
              name="password"
              placeholder="비밀번호를 입력하세요"
            />
            <p className={styles.error}>{errors.password?.message}</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.inputGroup}>
            <label>비밀번호 확인</label>
            <PasswordInput
              register={register}
              name="passwordConfirm"
              placeholder="비밀번호를 입력하세요"
            />
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
