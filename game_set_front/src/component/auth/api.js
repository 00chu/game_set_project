import axios from "axios";
import useAuthStore from "./store/authStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKSERVER,
  timeout: 5000,
});

// api 요청 서버로 전송 전 실행하는 검사기
// axios에 모든 요청 보내기 전 이 부분의 코드 실행하도록 함
api.interceptors.request.use(
  // 보내려고 하는 요청의 정보
  (config) => {
    // zustand에서 토큰을 가져옴
    const token = useAuthStore.getState().token;

    if (token) {
      // jwt 인증 표준 방식으로 토큰을 요청 헤더에 추가함
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 헤더 수정해서 이 헤더 요청을 전송
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 회원가입
export const signupApi = async (data) => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

// 로그인
export const loginApi = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export default api;
