package com.test.game_set_back.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    // 회원 번호 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 닉네임
    @Column(nullable = false, unique = true, length = 30)
    private String nickname;

    // 이메일
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // BCrypt 암호화 비밀번호 저장
    @Column(nullable = false)
    private String password;

    // 프로필 이미지 URL
    @Column(name = "profile_image", length = 500)
    private String profileImage;

    // 회원 상태 (ACTIVE, INACTIVE)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    // 가입 날짜 JPA는 createdAt 값을 자동으로 넣지 않음
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // JPA가 엔티티를 DB에 저장 전 자동으로 실행해주는 메서드. (기본값 설정)
    @PrePersist
    public void prePersist() {
        // 자동으로 createAt 값 넣음
        this.createdAt = LocalDateTime.now();

        // Status 값을 ACTIVE(Enum)으로 넣음
        if (this.status == null) {
            this.status = UserStatus.ACTIVE;
        }
    }
}