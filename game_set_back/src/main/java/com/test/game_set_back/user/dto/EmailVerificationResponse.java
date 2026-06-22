package com.test.game_set_back.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class EmailVerificationResponse {
    private String message;
    private Long expiredAt;

    public EmailVerificationResponse(String message, Long expiredAt) {
        this.message = message;
        this.expiredAt = expiredAt;
    }
}