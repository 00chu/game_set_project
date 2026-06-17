package com.test.game_set_back.user.controller;

import com.test.game_set_back.user.dto.LoginRequest;
import com.test.game_set_back.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(LoginRequest loginRequest){

        return ResponseEntity.ok(0);
    }

    // 이메일 인증
    @PostMapping("/email-verification")
    public ResponseEntity<?> sendEmailVerification(@RequestBody String email) {
        try {
            // 인증코드
            String authCode = userService.sendVerificationEmail(email);
            return ResponseEntity.ok(authCode);
        } catch (RuntimeException e) {
            // 중복 이메일, 빈 이메일 등 요청 오류
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 서버 내부 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이메일 발송에 실패했습니다.");
        }
    }
}
