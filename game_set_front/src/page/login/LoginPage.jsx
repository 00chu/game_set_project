import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../component/auth/validation/authSchema.js";
import styles from "./LoginPage.module.css";
import { loginApi } from "../../component/auth/api.js";
import { useAuthStore } from "../../component/auth/store/authStore.js";
import PasswordInput from "../../component/ui/PasswordInput.jsx";
import { useEffect } from "react";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      autoLogin: false,
      saveEmail: false,
      email: "",
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("saveEmail", true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const { autoLogin, saveEmail, email, password } = data;

    try {
      const response = await loginApi({
        email,
        password,
        autoLogin,
      });

      const user = {
        id: response.id,
        email: response.email,
        nickname: response.nickname,
        profileImage: response.profileImage,
      };

      const storage = autoLogin ? localStorage : sessionStorage;

      // 스토리지에 토큰과 유저 정보 저장
      storage.setItem("token", response.token);
      storage.setItem("user", JSON.stringify(user));

      // 아이디 저장
      if (saveEmail) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      // Zustand에 로그인 정보 저장
      login(user, response.token);

      console.log(useAuthStore.getState());

      // 로그인 후 홈으로 이동, 뒤로 가기 방지
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      const message = error.response?.data;

      // 백엔드 메시지 기준 처리
      if (message === "유저 정보 없음") {
        setError("email", {
          type: "manual",
          message: "존재하지 않는 계정입니다.",
        });
        return;
      }

      if (message === "틀린 비밀번호") {
        setError("password", {
          type: "manual",
          message: "비밀번호가 올바르지 않습니다.",
        });
        return;
      }

      setError("email", {
        type: "manual",
        message: "로그인에 실패했습니다.",
      });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>🎮</div>

        <h1>CodeArcade</h1>

        <p className={styles.description}>
          게임 기록과 랭킹을 저장하고 관리해보세요.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* 이메일 */}
          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              {...register("email")}
            />
            <p className={styles.error}>{errors.email?.message}</p>
          </div>

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

          <div className={styles.checkboxWrap}>
            {/* 아이디 저장 체크박스 */}
            <div className={styles.checkboxGroup}>
              <label>
                <input type="checkbox" {...register("saveEmail")} />
                아이디 저장
              </label>
            </div>
            {/* 자동 로그인 체크박스 */}
            <div className={styles.checkboxGroup}>
              <label>
                <input type="checkbox" {...register("autoLogin")} />
                자동 로그인
              </label>
            </div>
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

        <div className={styles.socialLoginSection}>
          <button
            type="button"
            className={styles.googleLoginBtn}
            onClick={() =>
              (window.location.href =
                "https://d2uftzitv8h5w8.cloudfront.net/api/oauth2/authorization/google?prompt=select_account")
            }
          >
            <GoogleIcon />
            <span>Google로 로그인</span>
          </button>

          <p className={styles.guide}>
            Google 계정으로 빠르게 로그인하고 게임 기록을 저장해보세요.
          </p>

          <p className={styles.subGuide}>
            다른 계정으로 로그인 시 Google 계정을 변경한 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
