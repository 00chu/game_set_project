package com.test.game_set_back.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long id;
    private String email;
    private String nickname;
    private String profileImage;
}
