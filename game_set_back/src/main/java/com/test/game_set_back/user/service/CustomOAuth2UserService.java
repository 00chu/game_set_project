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
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

        private final UserRepository userRepository;

        @Override
        public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        String profileImage =
                (picture != null && !picture.isBlank())
                        ? picture
                        : "https://d2uftzitv8h5w8.cloudfront.net/profile/default-profile.png";

        // 유저 있는지 확인
        User user = userRepository.findByEmail(email).orElse(null);

        // 없을 때만 생성
        if (user == null) {

                String baseNickname = (name != null ? name : "user");
                String nickname = baseNickname;

                int i = 1;
                while (userRepository.existsByNickname(nickname)) {
                nickname = baseNickname + i++;
                }

                user = User.builder()
                        .email(email)
                        .nickname(nickname)
                        .profileImage(profileImage)
                        .password("GOOGLE_LOGIN")
                        .status(UserStatus.ACTIVE)
                        .build();

                userRepository.save(user);
        }

        return new DefaultOAuth2User(
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_USER")
                ),
                oAuth2User.getAttributes(),
                "email"
        );
        }
}