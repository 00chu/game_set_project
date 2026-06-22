import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPage.module.css";

const MyPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [gameRecords, setGameRecords] = useState([]);

  // 유저 정보 불러오기 (임시)
  useEffect(() => {
    const fetchData = async () => {
      const res = {
        email: "test@gmail.com",
        nickname: "gamer01",
        profileImage: "",
      };

      setUser(res);
      setNickname(res.nickname);
      setPreview(res.profileImage);

      setGameRecords([
        { id: 1, game: "Tetris", score: 1200 },
        { id: 2, game: "Snake", score: 800 },
        { id: 3, game: "Pacman", score: 1500 },
      ]);
    };

    fetchData();
  }, []);

  // 이미지 변경
  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 저장
  const onSave = async () => {
    alert("정보 수정 완료!");
  };

  // 탈퇴
  const onDelete = () => {
    const ok = confirm("정말 탈퇴하시겠습니까?");
    if (!ok) return;

    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.container}>
      {/* LEFT - PROFILE */}
      <div className={styles.left}>
        <div className={styles.profileBox}>
          <img
            src={preview || "/default-profile.png"}
            className={styles.profileImg}
          />

          <div className={styles.fileBox}>
            <input
              type="file"
              id="fileInput"
              onChange={onImageChange}
              className={styles.fileInput}
            />
            <label htmlFor="fileInput" className={styles.fileBtn}>
              이미지 변경
            </label>
          </div>
        </div>

        <div className={styles.infoBox}>
          <h3>닉네임</h3>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className={styles.infoBox}>
          <h3>이메일</h3>
          <input value={user?.email || ""} disabled />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.saveBtn} onClick={onSave}>
            정보 저장
          </button>

          <button className={styles.deleteBtn} onClick={onDelete}>
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* RIGHT - GAME RECORDS */}
      <div className={styles.right}>
        <h2 className={styles.title}>🎮 Game Records</h2>

        <ul className={styles.list}>
          {gameRecords.map((g) => (
            <li key={g.id} className={styles.item}>
              <span>{g.game}</span>
              <span>{g.score}점</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyPage;
