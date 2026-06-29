package com.test.game_set_back.user.controller;

import com.test.game_set_back.common.enums.EmailAuthType;
import com.test.game_set_back.common.util.JwtUtil;
import com.test.game_set_back.user.dto.*;
import com.test.game_set_back.user.entity.User;
import com.test.game_set_back.user.repository.UserRepository;
import com.test.game_set_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private final UserRepository userRepository;

    // 이메일 인증코드 전송
    @PostMapping("/email-verification/signup")
    public ResponseEntity<?> sendEmailVerification(@RequestBody EmailRequest request) {
        System.out.println("email request 들어옴");
        
        try {
            // 인증코드 전송 완료 메시지
            EmailVerificationResponse response =
                    userService.sendVerificationEmail(request.getEmail(), EmailAuthType.SIGNUP);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // 중복 이메일, 빈 이메일 등 요청 오류
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            // 서버 내부 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이메일 발송 실패");
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
    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> signup(
            @ModelAttribute SignupRequest request
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

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        User user = userService.login(loginRequest);

        // 로그인한 유저의 아이디 등으로 토큰을 만들어 제공
        String token = jwtUtil.createToken(
                user,
                loginRequest.isAutoLogin()
        );

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .build();

        return ResponseEntity.ok(response);
    }

    // 비밀번호 변경 이메일 인증코드 전송
    @PostMapping("/email-verification/password-reset")
    public ResponseEntity<?> sendPasswordResetEmail(@RequestBody EmailRequest request) {
        try {
            // 인증코드 전송 완료 메시지
            EmailVerificationResponse response =
                    userService.sendVerificationEmail(request.getEmail(), EmailAuthType.PASSWORD_RESET);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // 중복 이메일, 빈 이메일 등 요청 오류
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            // 서버 내부 오류
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request){
        userService.changePassword(request);

        return ResponseEntity.ok("비밀번호 변경 완료");
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMyInfo(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                userService.getMyInfo(
                        authentication.getName()
                )
        );
    }

   @PatchMapping("/mypage")
    public ResponseEntity<MypageResponse> updateUser(
            Authentication authentication,
            @RequestParam String nickname,
            @RequestParam(required = false) MultipartFile profileImage
    ) {
        MypageResponse response = userService.updateUser(
                authentication.getName(),
                nickname,
                profileImage
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/mypage")
    public ResponseEntity<?> deleteUser(
            Authentication authentication
    ) {
        userService.deleteUser(
                authentication.getName()
        );
        return ResponseEntity.ok("회원 탈퇴 완료");
    }
}
