import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordInput = ({ register, name, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...register(name)}
        style={{
          width: "100%",
          paddingRight: "40px",
        }}
      />

      <span
        onClick={() => setShow((prev) => !prev)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        {show ? (
          <VisibilityOffIcon fontSize="small" />
        ) : (
          <VisibilityIcon fontSize="small" />
        )}
      </span>
    </div>
  );
};

export default PasswordInput;
