package com.test.game_set_back.user.dto;

import com.test.game_set_back.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private User user;
}
