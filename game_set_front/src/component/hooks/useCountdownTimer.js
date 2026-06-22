import { useEffect, useRef, useState } from "react";

export const useCountdownTimer = () => {
  const [time, setTime] = useState(0); // 화면에 띄울 남은 시간
  const endTimeRef = useRef(null); // 끝나는 시간, useRef를 사용해서 리렌더 돼도 값이 유지됨
  const intervalRef = useRef(null); // 중복 타이머 방지 setInterval ID 저장

  // 서버에서 받은 인증번호의 만료 시간을 받음
  const startTimer = (expiredAt) => {
    endTimeRef.current = expiredAt;

    // 기존 타이머를 제거해서 중복 실행을 방지함
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 1초마다 실행
    intervalRef.current = setInterval(() => {
      const now = Date.now(); // 현재 timestamp

      // 남은 시간 계산
      const diff = Math.max(
        0,
        Math.floor((endTimeRef.current - Date.now()) / 1000),
      );

      setTime(diff); // 화면에 표시되는 값을 업데이트

      // 시간 끝나면 타이머 종료
      if (diff <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 1000);
  };

  // 화면 출력용 포맷
  const formatTime = () => {
    const minute = String(Math.floor(time / 60)).padStart(2, "0");
    const second = String(time % 60).padStart(2, "0");
    return `${minute}:${second}`;
  };

  // 메모리 누수 방지를 위하여 컴포넌트 사라질 때 타이머 제거
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { time, startTimer, formatTime };
};
