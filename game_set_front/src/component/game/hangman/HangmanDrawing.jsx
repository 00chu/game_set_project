const PARTS = [
  // 머리
  <circle
    key="head"
    cx="140"
    cy="75"
    r="25"
    stroke="currentColor"
    strokeWidth="5"
    fill="none"
  />,

  // 몸통
  <line
    key="body"
    x1="140"
    y1="100"
    x2="140"
    y2="180"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 왼팔
  <line
    key="left-arm"
    x1="140"
    y1="120"
    x2="105"
    y2="150"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 오른팔
  <line
    key="right-arm"
    x1="140"
    y1="120"
    x2="175"
    y2="150"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 왼다리
  <line
    key="left-leg"
    x1="140"
    y1="180"
    x2="110"
    y2="230"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,

  // 오른다리
  <line
    key="right-leg"
    x1="140"
    y1="180"
    x2="170"
    y2="230"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  />,
];

export default function HangmanDrawing({ mistakes }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        color: "white", // 다크 테마용
      }}
    >
      <svg width="260" height="320" viewBox="0 0 260 320">
        {/* 바닥 */}
        <line
          x1="20"
          y1="300"
          x2="220"
          y2="300"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 세로 기둥 */}
        <line
          x1="50"
          y1="20"
          x2="50"
          y2="300"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 가로 기둥 */}
        <line
          x1="50"
          y1="20"
          x2="140"
          y2="20"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 줄 */}
        <line
          x1="140"
          y1="20"
          x2="140"
          y2="50"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 신체 */}
        {PARTS.slice(0, mistakes)}
      </svg>
    </div>
  );
}
