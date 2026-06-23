import styles from "../../../page/game/GameHistoryPage.module.css";

const GameRanking = ({ records }) => {
  return (
    <div className={styles.rankingBox}>
      <div className={styles.header}>
        <span>RANK</span>
        <span>NAME</span>
        <span className={styles.headerScore}>SCORE</span>
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
        </div>
      ))}
    </div>
  );
};

export default GameRanking;
