package com.test.game_set_back.user.service;

import com.test.game_set_back.common.util.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    // 실제로 이메일을 전송하는 로직 담당 클래스
    private final EmailSender emailSender;

    // 스레드에서 따로 실행되도록 비동기로 동작시킴
    @Async
    public void sendEmail(String email, String content) {
        emailSender.sendMail(
                "CodeArcade 인증번호",
                email,
                content
        );
    }
}