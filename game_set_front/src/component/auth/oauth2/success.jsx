import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfoApi } from "../../mypage/api";
import { useAuthStore } from "../store/authStore";

const OAuth2Success = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const processLogin = async () => {
      const params = new URLSearchParams(window.location.search);

      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);

      const user = await getMyInfoApi();

      login(user, token);

      // 로그인 후 홈으로 이동. 뒤로 가기 방지
      navigate("/", { replace: true });
    };

    processLogin();
  }, []);

  return <div>로그인 중...</div>;
};

export default OAuth2Success;
