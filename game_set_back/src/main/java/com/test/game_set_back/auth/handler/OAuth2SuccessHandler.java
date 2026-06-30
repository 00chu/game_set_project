package com.test.game_set_back.auth.handler;

import com.test.game_set_back.common.util.JwtUtil;
import com.test.game_set_back.user.entity.User;
import com.test.game_set_back.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
// 의존성 주입 생성자 생성하는 역할
@RequiredArgsConstructor
// OAuth 로그인 성공 시 실행되는 커스텀 핸들러
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil; // JWT 토큰 생성
    private final UserRepository userRepository; // 사용자 조회

    @Override
    // 로그인 성공 시 실행되는 핵심 메서드
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication // Spring Security가 생성한 로그인 결과 객체
    ) throws IOException {
        OAuth2User oAuth2User =
                (OAuth2User) authentication.getPrincipal(); // 로그인한 실제 사용자 정보

        String email = oAuth2User.getAttribute("email");

        // OAuth 로그인은 인증만 해주기 떄문에 email 기준으로 기존 유저 찾음
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // JWT 토큰 생성
        String token = jwtUtil.createToken(user, false);

        // 백엔드 → 프론트 CloudFront URL로 redirect, 프론트로 리다이렉트
        response.sendRedirect(
                "https://d2uftzitv8h5w8.cloudfront.net/oauth2/success?token=" + token
        );
    }
}