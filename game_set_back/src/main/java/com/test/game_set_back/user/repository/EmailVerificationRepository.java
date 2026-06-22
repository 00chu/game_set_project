package com.test.game_set_back.user.repository;

import com.test.game_set_back.common.enums.EmailAuthType;
import com.test.game_set_back.user.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository
        // Spring Data JPA가 실행 시점에 자동으로 구현체를 만들어줌
        extends JpaRepository<EmailVerification, Long> {

    // Optional<EmailVerification> - 값이 있을 수도 없을 수도 있음을 나타냄
    Optional<EmailVerification> findByEmail(String email);

    void deleteByEmail(String email);

    // Optional<EmailVerification> - 값이 있을 수도 없을 수도 있음을 나타냄
    Optional<EmailVerification> findTopByEmailOrderByIdDesc(String email);

    Optional<EmailVerification> findByEmailAndTypeAndVerifiedTrue(String email, EmailAuthType type);
}