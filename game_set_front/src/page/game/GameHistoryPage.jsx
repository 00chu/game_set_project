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

  //const [records, setRecords] = useState();
  /*
  useEffect(() => {
    fetchRanking(gameName).then(setRecords);
  }, [gameName]);
*/
  // 임시 데이터 (나중에 API로 교체)
  const records = [
    { id: 1, nickname: "aaa", score: 10 },
    { id: 2, nickname: "bbb", score: 8 },
  ];

  const myNickname = user?.nickname;

  // 내 기록만
  const myRecords = records.filter((r) => r.nickname === myNickname);
  const hasMyRecords = myRecords.length > 0;

  // 내 최고 등수
  const myBest = hasMyRecords ? myRecords[0] : null;

  const merged = myBest ? [...records, myBest] : records;

  // 게임에 따라 정렬 로직 다르게 ( 1 ~ 10등 + 내 최고기록 )
  const sorted = [...merged].sort((a, b) => {
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
          <GameRanking records={top10} />
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
          ) : hasMyRecords ? (
            myRecords.map((r, i) => (
              <div key={r.id} className={styles.myRow}>
                <span>{i + 1}</span>
                <span>{r.nickname}</span>
                <span>{r.score}</span>
              </div>
            ))
          ) : (
            <div className={styles.emptyMyBox}>
              아직 내가 플레이한 기록이 없습니다
            </div>
          )}
        </div>

        {/* 내 최고 등수 */}
        {myRecords.length > 0 && (
          <div className={styles.myRankBox}>
            내 최고 등수: <b>{myRecords[0].rank ?? "?"}등</b>
          </div>
        )}

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
