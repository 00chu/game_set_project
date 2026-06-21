package com.test.game_set_back.user.controller;

import com.test.game_set_back.user.dto.EmailRequest;
import com.test.game_set_back.user.dto.EmailVerificationResponse;
import com.test.game_set_back.user.dto.LoginRequest;
import com.test.game_set_back.user.dto.EmailVerifyRequest;
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

    // 이메일 인증코드 전송
    @PostMapping("/email-verification")
    public ResponseEntity<?> sendEmailVerification(@RequestBody EmailRequest request) {
        try {
            // 인증코드 전송 완료 메시지
            EmailVerificationResponse response =
                    userService.sendVerificationEmail(request.getEmail());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // 중복 이메일, 빈 이메일 등 요청 오류
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 서버 내부 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이메일 발송에 실패했습니다.");
        }
    }

    // 이메일 인증번호 시간 만료 확인
    @PostMapping("/email-verification/check")
    public ResponseEntity<?> verifyEmail(
            @RequestBody EmailVerifyRequest request
    ) {
        try {
            String message = userService.verifyEmail(
                    request.getEmail(),
                    request.getCode()
            );

            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody SignupRequest request
    ) {
        try {
            String message = userService.signup(request);

            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원가입에 실패했습니다.");
        }
    }
}
