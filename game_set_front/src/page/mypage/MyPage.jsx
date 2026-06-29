import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPage.module.css";
import { useAuthStore } from "../../component/auth/store/authStore";
import {
  getMyInfoApi,
  updateUserApi,
  deleteUserApi,
} from "../../component/mypage/api";
import { signupSchema } from "../../component/auth/validation/authSchema";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import PaletteIcon from "@mui/icons-material/Palette";

const MyPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState(null);
  const [gameRecords, setGameRecords] = useState([]);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfoApi();

        setUser(data);
        setNickname(data.nickname);
        setPreview(data.profileImage);

        setGameRecords(data.gameRecords || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyInfo();
  }, []);

  // 게임 기록, 주소 설정
  const gameNameMap = {
    BASEBALL: "Number Baseball",
    COLOR_MATCH: "Color Match",
  };

  const gamePathMap = {
    BASEBALL: "/baseball",
    COLOR_MATCH: "/colorMatch",
  };

  const baseballBest = gameRecords
    .filter((g) => g.gameName === "BASEBALL")
    .sort((a, b) => a.score - b.score)[0];

  const colorBest = gameRecords
    .filter((g) => g.gameName === "COLOR_MATCH")
    .sort((a, b) => b.score - a.score)[0];

  const onImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const [nicknameError, setNicknameError] = useState("");

  const updateAuthUser = useAuthStore((state) => state.updateUser);

  const onSave = async () => {
    try {
      await signupSchema.validateAt("nickname", {
        nickname,
      });

      setNicknameError("");

      const formData = new FormData();

      formData.append("nickname", nickname);

      if (image) {
        formData.append("profileImage", image);
      }

      const updatedUser = await updateUserApi(formData);

      setUser(updatedUser);

      updateAuthUser({
        nickname: updatedUser.nickname ?? user.nickname,
        profileImage: updatedUser.profileImage ?? user.profileImage,
      });

      setNickname(updatedUser.nickname);
      setPreview(updatedUser.profileImage);

      alert("정보 수정 완료!");
    } catch (error) {
      setNicknameError(error.message);
    }
  };

  const onCancel = () => {
    if (!user) return;

    setNickname(user.nickname);
    setPreview(user.profileImage || "");
    setImage(null);
    setNicknameError("");
  };

  const logout = useAuthStore((state) => state.logout);

  const onDelete = async () => {
    const ok = confirm("정말 탈퇴하시겠습니까?");
    if (!ok) return;

    await deleteUserApi();

    logout();

    localStorage.clear();
    sessionStorage.clear();

    navigate("/", { replace: true });
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
              accept="image/*"
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
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError("");
            }}
          />

          {nicknameError && <p className={styles.error}>{nicknameError}</p>}
        </div>

        <div className={styles.infoBox}>
          <h3>이메일</h3>
          <input value={user?.email || ""} disabled />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.saveBtn} onClick={onSave}>
            정보 저장
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            수정 취소
          </button>
          <button className={styles.deleteBtn} onClick={onDelete}>
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* RIGHT - GAME RECORDS */}
      <div className={styles.right}>
        <h2 className={styles.title}>
          <EmojiEventsIcon
            sx={{
              fontSize: 20,
              color: "var(--accent-hover)",
              marginRight: 1,
            }}
          />
          Best Records
        </h2>

        <div className={styles.item} onClick={() => navigate("/baseball")}>
          <SportsBaseballIcon
            sx={{
              fontSize: 20,
              color: "var(--accent-hover)",
            }}
          />
          <span>Number Baseball</span>
          <span>{baseballBest ? `${baseballBest.score}회` : "기록 없음"}</span>
        </div>

        <div className={styles.item} onClick={() => navigate("/colorMatch")}>
          <PaletteIcon
            sx={{
              fontSize: 20,
              color: "var(--accent-hover)",
            }}
          />
          <span>Color Match</span>
          <span>{colorBest ? `${colorBest.score}점` : "기록 없음"}</span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
