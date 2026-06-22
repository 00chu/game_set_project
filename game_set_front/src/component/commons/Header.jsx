import { Link } from "react-router-dom";
import styles from "./commons.module.css";
import { useAuthStore } from "../auth/store/authStore";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        🎮 CodeArcade
      </Link>

      {user ? (
        <div className={styles.userBox}>
          <img
            className={styles.profileImg}
            src={user.profileImage || "/default-profile.png"}
            alt="profile"
          />

          <Link to="/mypage" className={styles.nickname}>
            {user.nickname}
          </Link>

          <button className={styles.badge} onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <Link to="/login" className={styles.badge}>
          Log In
        </Link>
      )}
    </header>
  );
};

export default Header;
