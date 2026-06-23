import { useAuthStore } from "./store/authStore";

export const logoutUser = () => {
  // 로그인 정보만 삭제 (아이디 유지)
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.clear();

  useAuthStore.getState().logout();

  // 어디서 호출하든 홈으로 이동하게
  window.location.href = "/";
};
