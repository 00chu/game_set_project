import axios from "axios";
import { useAuthStore } from "../auth/store/authStore";
import { logoutUser } from "../auth/auth";

// 공통 axios 인스턴스
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKSERVER,
  timeout: 5000,
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 게임 기록 저장 API
export const saveRecordApi = async (data) => {
  const res = await api.post("/games/record", data);
  return res.data;
};

// 랭킹 조회 API
export const fetchRanking = async (gameName) => {
  const res = await api.get(`/games/ranking/${gameName}`);
  return res.data;
};
