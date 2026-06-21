package com.test.game_set_back.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class EmailVerificationResponse {

    private String message;
    private LocalDateTime expiredAt;
}