export const GAME_CONFIG = {
  BASEBALL: {
    sort: "asc", // 낮을수록 좋은 점수
    scoreLabel: "TRY",
    gamePath: "/baseball",
  },

  COLOR_MATCH: {
    sort: "desc", // 높을수록 좋은 점수
    scoreLabel: "SCORE",
    gamePath: "/colorMatch",
  },

  HANGMAN: {
    sort: "desc", // 남은 목숨이 많을수록 좋은 점수
    scoreLabel: "LIFE",
    gamePath: "/hangman",
  },
};
