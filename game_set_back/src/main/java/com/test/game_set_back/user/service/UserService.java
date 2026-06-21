package com.test.game_set_back.user.service;

import com.test.game_set_back.user.dto.EmailVerificationResponse;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

import com.test.game_set_back.user.repository.UserRepository;
import com.test.game_set_back.user.repository.EmailVerificationRepository;
import com.test.game_set_back.common.util.EmailSender;
import com.test.game_set_back.user.entity.EmailVerification;

@RequiredArgsConstructor // 생성자 주입을 위한 어노테이션
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailSender emailSender;

    public EmailVerificationResponse sendVerificationEmail(String email) {
        // 이메일 입력 여부
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("이메일을 입력해주세요.");
        }

        // 중복 이메일 검사
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 6자리 인증번호 생성
        String authCode = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        // 이메일 내용 생성
        String content = """
            <div style="
                background-color:#0f172a;
                padding:40px;
                text-align:center;
                color:#ffffff;
                font-family:Arial, sans-serif;
                border-radius:12px;
            ">
                <h1 style="
                    color:#00ffd5;
                    font-size:32px;
                    margin-bottom:10px;
                ">
                    🎮 CodeArcade
                </h1>
            
                <h2 style="
                    color:#ffffff;
                    margin-bottom:20px;
                ">
                    이메일 인증
                </h2>
            
                <p style="
                    color:#cccccc;
                    font-size:16px;
                ">
                    인증 코드를 입력해주세요.
                </p>
            
                <div style="
                    background:#1e1e1e;
                    border:2px solid #00ffd5;
                    border-radius:10px;
                    padding:20px;
                    margin:30px auto;
                    width:200px;
                    box-shadow:0 0 15px #00ffd5;
                ">
                    <h1 style="
                        color:#00ffd5;
                        letter-spacing:8px;
                        margin:0;
                        font-size:36px;
                    ">
                        %s
                    </h1>
                </div>
            
                <p style="
                    color:#888888;
                    font-size:13px;
                ">
                    ⚠️ 인증번호는 5분 동안만 유효합니다.<br>
                    타인에게 인증번호를 공유하지 마세요.
                </p>
            </div>
            """.formatted(authCode); // 포맷 문자열 방식

        // 인증번호 생성 시간
        LocalDateTime createdAt = LocalDateTime.now();

        // 만료 시간 (현재 시간 + 5분)
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);

        // DB 저장
        EmailVerification verification =
                new EmailVerification( // EmailVerification 객체 생성, DB에 저장 X
                        email,
                        authCode,
                        createdAt,
                        expiredAt
                );

        // JPA가 verification 객체를 보고 SQL을 만들어 실행
        // JPA를 통해 DB에 저장 요청을 하는 코드
        emailVerificationRepository.save(verification);

        // 이메일 발송
        emailSender.sendMail(
                "CodeArcade 인증번호", // 이메일 제목
                email,  // 받는 사람의 이메일
                content // 이메일 내용
        );

        // 프론트에 인증번호를 보내지 않고 발송 완료 표시와 만료시간만 전송
        return new EmailVerificationResponse(
                "인증번호가 발송되었습니다.",
                expiredAt
        );
    }

    public String verifyEmail(String email, String code) {
        EmailVerification verification =
                emailVerificationRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("인증 요청이 없습니다.")
                        );

        // 인증번호 확인
        if (!verification.getCode().equals(code)) {
            throw new RuntimeException("인증번호가 일치하지 않습니다.");
        }

        // 시간 확인
        if (LocalDateTime.now()
                .isAfter(verification.getExpiredAt())) {
            throw new RuntimeException("인증 시간이 만료되었습니다.");
        }

        // 인증 성공 처리
        verification.verify();

        emailVerificationRepository.save(verification);

        return "이메일 인증이 완료되었습니다.";
    }

}
