import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameRanking from "../../component/game/Ranking/GameRanking";
import styles from "./GameHistoryPage.module.css";
import { useEffect, useState } from "react";
import { fetchRanking } from "../../component/game/api";
import { GAME_CONFIG } from "../../component/game/Ranking/gameConfig";
import { useAuthStore } from "../../component/auth/store/authStore";

const GameHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);

  // 파라미터 변수로 받은 게임 이름을 저장
  const { gameName } = useParams();

  const config = GAME_CONFIG[gameName];

  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRanking(gameName).then(setRecords);
  }, [gameName]);

  const myNickname = user?.nickname;

  const myRecords = records.filter((r) => r.nickname === myNickname);

  // 내 기록 중 가장 등수가 높은 것 하나만 출력
  const myBestRecord =
    myRecords.length > 0
      ? [...myRecords].sort((a, b) => {
          if (gameName === "HANGMAN") {
            // 목숨 많은 순 -> 시간이 짧은 순
            if (b.score !== a.score) {
              return b.score - a.score;
            }

            return a.playTime - b.playTime;
          }

          return config?.sort === "asc" ? a.score - b.score : b.score - a.score;
        })[0]
      : null;
  const hasMyRecords = myRecords.length > 0;

  // 게임에 따라 정렬 로직 다르게 ( 1 ~ 10등 + 내 최고기록 )
  const sorted = [...records].sort((a, b) => {
    if (gameName === "HANGMAN") {
      // 남은 목숨 많은 순
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // 같은 목숨이면 플레이 시간 짧은 순
      return a.playTime - b.playTime;
    }

    return config?.sort === "asc" ? a.score - b.score : b.score - a.score;
  });

  // TOP 10
  const top10 = sorted.slice(0, 10);

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <h1 className={styles.title}>
          <span>{gameName.replaceAll("_", " ")}</span> RANKING
        </h1>

        {/* 전체 랭킹 */}
        {top10.length === 0 ? (
          <div className={styles.emptyBox}>아직 전체 기록이 없습니다</div>
        ) : (
          <GameRanking records={top10} gameName={gameName} />
        )}

        {/* 내 기록 영역 */}
        <div className={styles.mySection}>
          <h2>MY RECORD</h2>

          {!user ? (
            <div className={styles.emptyMyBox}>
              <p className={styles.emptyText}>
                로그인 후 내 플레이 기록을 확인하세요
              </p>

              <button
                className={styles.loginBtn}
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          ) : myBestRecord ? (
            <div className={styles.myRow}>
              <span>BEST</span>
              <span>{myBestRecord.nickname}</span>
              <span>{myBestRecord.score}</span>

              {gameName === "HANGMAN" && <span>{myBestRecord.playTime}s</span>}
            </div>
          ) : (
            <div className={styles.emptyMyBox}>
              아직 내가 플레이한 기록이 없습니다
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className={styles.btnRow}>
          <button onClick={() => navigate(config?.gamePath || "/")}>
            RETRY
          </button>

          <button onClick={() => (window.location.href = "/")}>HOME</button>
        </div>
      </div>
    </div>
  );
};

export default GameHistoryPage;
