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

        System.out.println("🔥 CUSTOM OAUTH2 USER SERVICE");

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        System.out.println("GOOGLE EMAIL = " + email);

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {

                    System.out.println("신규 회원 생성");

                    User newUser = User.builder()
                            .email(email)
                            .nickname(name)
                            .profileImage(picture)
                            .password("GOOGLE_LOGIN")
                            .status(UserStatus.ACTIVE)
                            .build();

                    User saved = userRepository.save(newUser);

                    System.out.println("저장 완료 ID = " + saved.getId());

                    return saved;
                });

        return new DefaultOAuth2User(
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_USER")
                ),
                oAuth2User.getAttributes(),
                "email"
        );
    }
}