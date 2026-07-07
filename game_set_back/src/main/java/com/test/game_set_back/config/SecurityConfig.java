package com.test.game_set_back.config;

import com.test.game_set_back.common.util.JwtAuthenticationFilter;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.http.HttpServletResponse;

import com.test.game_set_back.auth.handler.OAuth2SuccessHandler;
import com.test.game_set_back.user.service.CustomOAuth2UserService;

import java.util.List;

@Configuration
@RequiredArgsConstructor // 생성자 자동 생성
//J WT + OAuth + CORS + 권한 정책 연결
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // 구글 로그인
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;

    // @CrossOrigin("*") 와 allowCredentials(true)는 
    // 브라우저 CORS 규칙 상 동시에 사용할 수 없음
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS (교차 출처 리소스 공유(프론트 ↔ 백엔드 다른 도메인 허용)) 활성화
                .cors(cors -> {})
                // CSRF (Cross-Site Request Forgery) 비활성화, JWT 방식에서는 사용 X
                .csrf(csrf -> csrf.disable())
                // Spring 기본 로그인 화면 사용하지 않음
                .formLogin(form -> form.disable())
                // 기본 인증 방식 사용하지 않음
                .httpBasic(httpBasic -> httpBasic.disable())
                // redirect 방어, 인증 실패를 처리하는 부분
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"unauthorized\"}");
                        })
                )
                // API 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/users/login",
                                "/users/signup",
                                "/users/email-verification/**",
                                "/users/change-password",
                                // "/users/mypage",
                                "/games/**",

                                "/api/users/login",
                                "/api/users/signup",
                                "/api/users/email-verification/**",
                                "/api/users/change-password",

                                "/api/oauth2/**",
                                "/api/login/oauth2/**",

                                "/api/games/**"
                        ).permitAll() // 로그인 없이도 가능하도록 함
                        .anyRequest().authenticated() // 나머지는 로그인 필요하도록
                )
                // OAuth2 로그인 설정하는 부분
                .oauth2Login(oauth2 -> {
                    oauth2.userInfoEndpoint(userInfo -> {
                        // 구글 로그인 후 사용자 정보를 처리
                        userInfo.userService(customOAuth2UserService);
                    });
                    // 로그인 성공 시 JWT 발급 로직 실행
                    oauth2.successHandler(oAuth2SuccessHandler);
                })
                // JWT 필터 등록
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 허용되는 도메인 URL
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://game-project-choi.s3-website.ap-northeast-2.amazonaws.com",
                "https://d2uftzitv8h5w8.cloudfront.net"
        ));

        // 허용되는 HTTP 메서드
        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // 모든 헤더 허용
        config.setAllowedHeaders(List.of("*"));

        // 쿠키, Authorization 헤더 허용
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }

    @Bean
    // 비밀번호 암호화
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}