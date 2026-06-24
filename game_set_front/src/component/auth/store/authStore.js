import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    // 새로 고침 시 로그인 상태를 유지하기 위해 사용. localStorage에 자동 저장
    (set) => ({
      // 상태
      user: null,
      token: null, // 토큰 유무로 로그인 여부 판단

      // 로그인
      login: (user, token) =>
        set({
          user,
          token,
        }),

      // 로그아웃
      logout: () =>
        set({
          user: null,
          token: null,
        }),

      // 사용자 정보 수정
      updateUser: (newUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newUser } : newUser,
        })),
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
    },
  ),
);
