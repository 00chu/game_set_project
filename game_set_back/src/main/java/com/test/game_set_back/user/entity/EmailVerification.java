package com.test.game_set_back.user.entity;

import com.test.game_set_back.common.enums.EmailAuthType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Getter
@NoArgsConstructor
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 인증할 이메일
    private String email;

    // 6자리 인증번호
    private String code;

    // 인증 번호 생성 시간
    private LocalDateTime createdAt;

    // 인증 만료 시간
    private LocalDateTime expiredAt;

    // 인증 여부
    private boolean verified;

    // 회원가입 / 비밀번호 찾기 타입
    @Enumerated(EnumType.STRING)
    private EmailAuthType type;

    public EmailVerification(String email, String code, LocalDateTime createdAt, LocalDateTime expiredAt, EmailAuthType type) {
        this.email = email;
        this.code = code;
        this.createdAt = createdAt;
        this.expiredAt = expiredAt;
        this.verified = false;
        this.type = type;
    }

    public void verify() {
        this.verified = true;
    }
}