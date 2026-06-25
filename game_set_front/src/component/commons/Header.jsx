import { Link, useNavigate } from "react-router-dom";
import styles from "./commons.module.css";
import { useAuthStore } from "../auth/store/authStore";

const Header = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        🎮 CodeArcade
      </Link>

      <div className={styles.userBox}>
        {user ? (
          <>
            <img
              className={styles.profileImg}
              src={user.profileImage || "/default-profile.png"}
              alt="profile"
            />

            {user.nickname && (
              <Link to="/mypage" className={styles.nickname}>
                {user.nickname}
              </Link>
            )}

            <button className={styles.badge} onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.badge}>
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
