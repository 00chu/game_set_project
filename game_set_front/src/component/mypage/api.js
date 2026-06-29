import axios from "axios";
import { useAuthStore } from "../auth/store/authStore";
import { logoutUser } from "../auth/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKSERVER,
  timeout: 5000,
});

// 인터셉터
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // 토큰 만료 (401) 시에 자동으로 로그아웃
    if (error.response?.status === 401 || error.response?.status === 403) {
      logoutUser();
    }

    return Promise.reject(error);
  },
);

// api 요청 서버로 전송 전 실행하는 검사기
// axios에 모든 요청 보내기 전 이 부분의 코드 실행하도록 함
api.interceptors.request.use(
  // 보내려고 하는 요청의 정보
  (config) => {
    // zustand에서 토큰을 가져옴
    const token =
      useAuthStore.getState().token || localStorage.getItem("token");

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

export const getMyInfoApi = async (token) => {
  const response = await api.get("/users/mypage", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const updateUserApi = async (formData) => {
  const response = await api.patch("/users/mypage", formData);

  return response.data;
};

export const deleteUserApi = async () => {
  const response = await api.delete("/users/mypage");

  return response.data;
};
