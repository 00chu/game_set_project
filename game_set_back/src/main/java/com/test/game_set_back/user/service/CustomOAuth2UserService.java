package com.test.game_set_back.user.service;

import com.test.game_set_back.user.entity.User;
import com.test.game_set_back.user.entity.UserStatus;
import com.test.game_set_back.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
// OAuth 로그인 + 자동 회원가입 + Spring Security 사용자 생성
// DefaultOAuth2UserService - 구글에서 받은 user info를 커스터마이징
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

        private final UserRepository userRepository;

        @Override
        public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // 실제 구글 데이터 가져오는 부분
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 데이터 추출
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // 구글 이미지 없으면 기본 이미지 사용하게 하여 프로필 이미지 처리
        String profileImage =
                (picture != null && !picture.isBlank())
                        ? picture
                        : "https://d2uftzitv8h5w8.cloudfront.net/profile/default-profile.png";

        // 유저 있는지 확인
        User user = userRepository.findByEmail(email).orElse(null);

        // 없을 때만 생성
        if (user == null) {

                // 닉네임 중복 방지를 위해 중복 시 뒤에 숫자로 중복 방지
                String baseNickname = (name != null ? name : "user");
                String nickname = baseNickname;

                int i = 1;
                while (userRepository.existsByNickname(nickname)) {
                nickname = baseNickname + i++;
                }

                // 유저 생성
                user = User.builder()
                        .email(email)
                        .nickname(nickname)
                        .profileImage(profileImage)
                        .password("GOOGLE_LOGIN")
                        .status(UserStatus.ACTIVE)
                        .build();

                // DB 저장
                userRepository.save(user);
        }

        // Spring Security 사용자 객체 반환
        return new DefaultOAuth2User(
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_USER")
                ),
                oAuth2User.getAttributes(),
                "email"
        );
        }
}