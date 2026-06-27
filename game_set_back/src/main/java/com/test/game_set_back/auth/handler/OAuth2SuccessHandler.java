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
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        System.out.println("===== SUCCESS HANDLER =====");
        System.out.println("authentication.getName() = " + authentication.getName());

        OAuth2User oAuth2User =
                (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");

        System.out.println("SUCCESS EMAIL = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.createToken(user, false);

        response.sendRedirect(
                "http://52.78.171.157:8080/game_set_project/oauth2/success?token=" + token
        );
    }
}