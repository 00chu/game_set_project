package com.test.game_set_back.user.repository;

import com.test.game_set_back.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 닉네임 중복 체크
    boolean existsByNickname(String nickname);

    // 로그인 조회
    Optional<User> findByEmail(String email);

}