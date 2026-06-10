import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <div className={styles.login_div}>
        <p>LOGIN</p>
        <form>
          <ul>
            <li>아이디</li>
            <li>
              <input></input>
            </li>
          </ul>
          <ul>
            <li>비밀번호</li>
            <li>
              <input></input>
            </li>
          </ul>
          <button>LOGIN</button>
        </form>
        <div className={styles.link}>
          <Link>회원가입</Link>
          <Link>아이디/비밀번호 찾기</Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
