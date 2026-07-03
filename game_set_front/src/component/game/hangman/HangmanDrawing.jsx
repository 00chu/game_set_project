const HEAD = (
  <div
    style={{
      width: 50,
      height: 50,
      border: "5px solid #111",
      borderRadius: "50%",
      position: "absolute",
      top: 50,
      left: 95,
    }}
  />
);

const BODY = (
  <div
    style={{
      width: 5,
      height: 90,
      background: "#111",
      position: "absolute",
      top: 100,
      left: 120,
    }}
  />
);

const LEFT_ARM = (
  <div
    style={{
      width: 60,
      height: 5,
      background: "#111",
      position: "absolute",
      top: 125,
      left: 68,
      transform: "rotate(-30deg)",
      transformOrigin: "right center",
    }}
  />
);

const RIGHT_ARM = (
  <div
    style={{
      width: 60,
      height: 5,
      background: "#111",
      position: "absolute",
      top: 125,
      left: 122,
      transform: "rotate(30deg)",
      transformOrigin: "left center",
    }}
  />
);

const LEFT_LEG = (
  <div
    style={{
      width: 70,
      height: 5,
      background: "#111",
      position: "absolute",
      top: 205,
      left: 58,
      transform: "rotate(-50deg)",
      transformOrigin: "right center",
    }}
  />
);

const RIGHT_LEG = (
  <div
    style={{
      width: 70,
      height: 5,
      background: "#111",
      position: "absolute",
      top: 205,
      left: 122,
      transform: "rotate(50deg)",
      transformOrigin: "left center",
    }}
  />
);

const BODY_PARTS = [HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG];

export default function HangmanDrawing({ mistakes }) {
  return (
    <div
      style={{
        position: "relative",
        width: 250,
        height: 320,
        margin: "0 auto",
      }}
    >
      {BODY_PARTS.slice(0, mistakes)}

      {/* 밧줄 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 120,
          width: 4,
          height: 50,
          background: "#111",
        }}
      />

      {/* 가로대 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          width: 100,
          height: 4,
          background: "#111",
        }}
      />

      {/* 세로대 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          width: 4,
          height: 300,
          background: "#111",
        }}
      />

      {/* 바닥 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 180,
          height: 4,
          background: "#111",
        }}
      />
    </div>
  );
}
