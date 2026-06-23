package com.test.game_set_back.common.util;

import com.test.game_set_back.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // properties에 있는 jwt.secret값을 가져와 시크릿키로 사용함.
    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // 기본 로그인 토큰 유효 시간 1일
    private final long SHORT_EXPIRATION_TIME = 24 * 60 * 60 * 1000L;

    // 자동 로그인 토큰 유효 시간 7일
    private final long LONG_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L;

    // 토큰 생성
    public String createToken(
            User user,
            boolean autoLogin
    ) {
        Date now = new Date();

        // 자동로그인 선택 여부에 따라 토큰 유효 시간/기간 다르게
        long expirationTime =
                autoLogin ? LONG_EXPIRATION_TIME : SHORT_EXPIRATION_TIME;

        // 유효 기간을 현재 시간에서 현재 시간 + 토큰 유효시간으로 설정
        Date expiryDate =
                new Date(now.getTime() + expirationTime);

        // 토큰 반환
        return Jwts.builder()
                .setSubject(user.getEmail()) // 토큰 소유자, 유저 식별자
                .claim("nickname", user.getNickname())
                .setIssuedAt(now) // 토큰 발급 시간
                .setExpiration(expiryDate) // 토큰 만료 시간
                .signWith(getKey()) // 서명
                .compact(); //토큰 직렬화 및 문자열 반환
    }

    // 토큰 파싱
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public String getNickname(String token) {
        return parseClaims(token)
                .get("nickname", String.class);
    }
}