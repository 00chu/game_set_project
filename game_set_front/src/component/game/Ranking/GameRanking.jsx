import styles from "../../../page/game/GameHistoryPage.module.css";

const GameRanking = ({ records, gameName }) => {
  const scoreTitle =
    gameName === "BASEBALL" ? "TRY" : gameName === "HANGMAN" ? "LIFE" : "SCORE";

  return (
    <div className={styles.rankingBox}>
      <div className={styles.header}>
        <span>RANK</span>
        <span>NAME</span>

        <span className={styles.headerScore}>{scoreTitle}</span>

        {gameName === "HANGMAN" && (
          <span className={styles.headerTime}>TIME</span>
        )}
      </div>

      {records.map((record, index) => (
        <div
          key={record.id}
          className={`${styles.row} ${
            index === 0
              ? styles.top1
              : index === 1
                ? styles.top2
                : index === 2
                  ? styles.top3
                  : ""
          }`}
        >
          <span className={styles.rank}>{index + 1}</span>

          <span className={styles.name}>{record.nickname}</span>

          <span className={styles.score}>{record.score}</span>

          {gameName === "HANGMAN" && (
            <span className={styles.time}>{record.playTime}s</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameRanking;
