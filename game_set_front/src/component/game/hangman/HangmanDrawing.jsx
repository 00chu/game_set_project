const HEAD = (
  <div
    style={{
      width: "50px",
      height: "50px",
      border: "5px solid black",
      borderRadius: "100%",
      position: "absolute",
      top: "50px",
      right: "-20px",
    }}
  />
);

const BODY = (
  <div
    style={{
      width: "5px",
      height: "100px",
      background: "black",
      position: "absolute",
      top: "100px",
      right: "0",
    }}
  />
);

const RIGHT_ARM = (
  <div
    style={{
      width: "70px",
      height: "5px",
      background: "black",
      position: "absolute",
      top: "130px",
      right: "-70px",
      rotate: "-30deg",
      transformOrigin: "left bottom",
    }}
  />
);

const LEFT_ARM = (
  <div
    style={{
      width: "70px",
      height: "5px",
      background: "black",
      position: "absolute",
      top: "130px",
      right: "5px",
      rotate: "30deg",
      transformOrigin: "right bottom",
    }}
  />
);

const RIGHT_LEG = (
  <div
    style={{
      width: "70px",
      height: "5px",
      background: "black",
      position: "absolute",
      top: "195px",
      right: "-60px",
      rotate: "60deg",
      transformOrigin: "left bottom",
    }}
  />
);

const LEFT_LEG = (
  <div
    style={{
      width: "70px",
      height: "5px",
      background: "black",
      position: "absolute",
      top: "195px",
      right: "-5px",
      rotate: "-60deg",
      transformOrigin: "right bottom",
    }}
  />
);

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

export default function HangmanDrawing({ mistakes }) {
  return (
    <div
      style={{
        position: "relative",
        width: "250px",
        height: "320px",
      }}
    >
      {BODY_PARTS.slice(0, mistakes)}

      <div
        style={{
          height: "50px",
          width: "5px",
          background: "black",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />

      <div
        style={{
          height: "5px",
          width: "120px",
          background: "black",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />

      <div
        style={{
          height: "300px",
          width: "5px",
          background: "black",
          marginLeft: "120px",
        }}
      />

      <div
        style={{
          height: "5px",
          width: "200px",
          background: "black",
        }}
      />
    </div>
  );
}
