package com.test.game_set_back.user.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequest {
    private String nickname;
    private String email;
    private String password;
    private String passwordConfirm;
    private MultipartFile profileImage;
}