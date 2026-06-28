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
public class SecurityConfig {

    @PostConstruct
    public void init() {
        System.out.println("🔥 SECURITY CONFIG LOADED");
    }

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // 구글 로그인
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS (교차 출처 리소스 공유) 활성화
                .cors(cors -> {})
                // CSRF (Cross-Site Request Forgery) 비활성화
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                // redirect 방어
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"unauthorized\"}");
                        })
                )
                // 모든 요청 허용 (개발용)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                /*
                                "/users/login",
                                "/users/signup",
                                "/users/email-verification/**",
                                "/users/change-password",
                                "/users/mypage",
                                "/games/**",
                                */

                                "/api/users/login",
                                "/api/users/signup",
                                "/api/users/email-verification/**",
                                "/api/users/change-password",

                                "/api/oauth2/**",
                                "/api/login/oauth2/**",

                                "/api/games/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> {

                    oauth2.userInfoEndpoint(userInfo -> {
                        System.out.println("🔥 userInfoEndpoint 등록");
                        userInfo.userService(customOAuth2UserService);
                    });

                    oauth2.successHandler(oAuth2SuccessHandler);
                })
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 주소 허용
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://game-project-choi.s3-website.ap-northeast-2.amazonaws.com",
                "https://d2uftzitv8h5w8.cloudfront.net"
        ));

        // HTTP 메서드 허용
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