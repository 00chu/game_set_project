package com.test.game_set_back.common.util;

import com.test.game_set_back.common.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
// 모든 HTTP 요청마다 한 번씩 실행되는 클래스
// OncePerRequestFilter - 요청당 1번만 실행, 중복 실행을 방지한다
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // JWT 생성 / 파싱 클래스
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        // Authorization 헤더 확인
        String authHeader = request.getHeader("Authorization");

        // 헤더가 없을 때 인증되지 않은 요청임으로 그냥 (로그인 없이) 통과
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // 헤더에서 토큰 추출
        String token =
                authHeader.substring(7);
        try {
            String email = jwtUtil.getEmail(token);

            // Spring Security가 이해할 수 있는 로그인 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            // 역할 지정, 현재 모든 유저가 USER 역할.
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );

            // Spring Security가 현재 로그인한 유저가 로그인 상태임을 인식하게 함
            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            // 요청이 계속 진행되도록 Controller로 이동함
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("토큰 만료");
        } catch (JwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("유효하지 않은 토큰");
        }
    }
}