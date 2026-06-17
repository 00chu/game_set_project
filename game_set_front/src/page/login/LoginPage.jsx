import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../component/auth/validation/authSchema.js";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("로그인 데이터:", data);
    
    const response = await loginApi(data);

    login(
      response.user,
      response.accessToken
    );
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
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password")}
            />
            <p className={styles.error}>{errors.password?.message}</p>
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
