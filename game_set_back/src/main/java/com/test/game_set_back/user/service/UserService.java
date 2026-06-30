package com.test.game_set_back.user.service;

import com.test.game_set_back.common.enums.EmailAuthType;
import com.test.game_set_back.common.s3.S3Service;
import com.test.game_set_back.game.dto.GameRecordResponse;
import com.test.game_set_back.user.dto.*;
import com.test.game_set_back.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import com.test.game_set_back.user.repository.UserRepository;
import com.test.game_set_back.user.repository.EmailVerificationRepository;
import com.test.game_set_back.common.util.EmailSender;
import com.test.game_set_back.user.entity.EmailVerification;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor // 생성자 주입을 위한 어노테이션
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailSender emailSender;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;

    @Transactional
    public EmailVerificationResponse sendVerificationEmail(String email, EmailAuthType type) {
        // 이메일 입력 여부
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("이메일을 입력해주세요.");
        }

        // 가입 - 중복 이메일 검사
        if (type == EmailAuthType.SIGNUP) {
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("이미 존재하는 이메일입니다.");
            }
        }

        // 비밀번호 찾기 - 해당 이메일 가입 여부 검사
        if (type == EmailAuthType.PASSWORD_RESET) {
            if (!userRepository.existsByEmail(email)) {
                throw new RuntimeException("가입되지 않은 이메일입니다.");
            }
        }

        // 해당 이메일로 이전에 했던 인증을 모두 삭제함
        emailVerificationRepository.deleteByEmail(email);

        // 6자리 인증번호 생성
        String authCode = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        // 인증번호 생성 시간
        LocalDateTime createdAt = LocalDateTime.now();

        // 만료 시간 (현재 시간 + 5분)
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);

        // 이메일 내용 생성
        String content = """
            <div style="
                background-color:#0f172a;
                padding:40px;
                text-align:center;
                color:#ffffff;
                font-family:Arial, sans-serif;
                border-radius:12px;
            ">
                <h1 style="
                    color:#00ffd5;
                    font-size:32px;
                    margin-bottom:10px;
                ">
                    🎮 CodeArcade
                </h1>
            
                <h2 style="
                    color:#ffffff;
                    margin-bottom:20px;
                ">
                    이메일 인증
                </h2>
            
                <p style="
                    color:#cccccc;
                    font-size:16px;
                ">
                    인증 코드를 입력해주세요.
                </p>
            
                <div style="
                    background:#1e1e1e;
                    border:2px solid #00ffd5;
                    border-radius:10px;
                    padding:20px;
                    margin:30px auto;
                    width:200px;
                    box-shadow:0 0 15px #00ffd5;
                ">
                    <h1 style="
                        color:#00ffd5;
                        letter-spacing:8px;
                        margin:0;
                        font-size:36px;
                    ">
                        %s
                    </h1>
                </div>
            
                <p style="
                    color:#888888;
                    font-size:13px;
                ">
                    ⚠️ 인증번호는 5분 동안만 유효합니다.<br>
                    타인에게 인증번호를 공유하지 마세요.
                </p>
            </div>
            """.formatted(authCode); // 포맷 문자열 방식

        // DB 저장
        EmailVerification verification =
                new EmailVerification( // EmailVerification 객체 생성, DB에 저장 X
                        email,
                        authCode,
                        createdAt,
                        expiredAt,
                        type
                );

        // JPA가 verification 객체를 보고 SQL을 만들어 실행
        // JPA를 통해 DB에 저장 요청을 하는 코드
        emailVerificationRepository.save(verification);

        // 이메일 발송
        emailService.sendEmail(
                email,  // 받는 사람의 이메일
                content // 이메일 내용
        );

        // 프론트에 인증번호를 보내지 않고 발송 완료 표시와 만료시간만 전송
        return new EmailVerificationResponse(
                "인증번호가 발송되었습니다.",
                expiredAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        );
    }

    @Transactional
    public String verifyEmail(String email, String code) {
        EmailVerification verification =
                emailVerificationRepository
                        // 이메일 인증 데이터 중 가장 최신 한 개만 가져오는 코드
                        .findTopByEmailOrderByIdDesc(email)
                        // 값이 없을 때 예외 발생
                        .orElseThrow(() ->
                                new RuntimeException("인증 요청이 없습니다.")
                        );

        // 이메일 중복 확인
        if (verification.isVerified()) {
            throw new RuntimeException("이미 인증된 이메일입니다.");
        }

        // 인증번호 확인
        if (!verification.getCode().equals(code)) {
            throw new RuntimeException("인증번호가 일치하지 않습니다.");
        }

        // 시간 확인
        if (LocalDateTime.now()
                .isAfter(verification.getExpiredAt())) {
            throw new RuntimeException("인증 시간이 만료되었습니다.");
        }

        // 인증 성공 처리
        verification.verify();

        // JPA를 통해 DB에 insert, update를 실행하는 코드
        emailVerificationRepository.save(verification);

        return "이메일 인증이 완료되었습니다.";
    }

    @Transactional
    public String signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 이메일 인증 확인
        EmailVerification verification =
                emailVerificationRepository
                        .findTopByEmailOrderByIdDesc(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException("이메일 인증을 진행해주세요.")
                        );

        if (!verification.isVerified()) {
            throw new RuntimeException("이메일 인증이 완료되지 않았습니다.");
        }

        // 이메일 중복 검사
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 닉네임 중복 검사
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        // 프로필 이미지
        String imageUrl =
        "https://d2uftzitv8h5w8.cloudfront.net/profile/default-profile.png";

        if (request.getProfileImage() != null &&
                !request.getProfileImage().isEmpty()) {
            imageUrl = s3Service.upload(
                    request.getProfileImage()
            );
        }

        // User 엔티티 생성
        User user = new User(
                request.getEmail(),
                request.getNickname(),
                encodedPassword,
                imageUrl
        );

        // 회원 저장
        userRepository.save(user);

        return "회원가입이 완료되었습니다.";
    }

    public User login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("틀린 비밀번호");
        }

        return user;
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        EmailVerification verification =
                emailVerificationRepository.findTopByEmailOrderByIdDesc(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("인증 정보 없음"));

        if (!verification.isVerified()) {
            throw new RuntimeException("이메일 인증이 완료되지 않았습니다.");
        }

        if (!verification.getCode().equals(request.getCode())) {
            throw new RuntimeException("인증번호가 틀렸습니다.");
        }

        if (LocalDateTime.now().isAfter(verification.getExpiredAt())) {
            throw new RuntimeException("인증이 만료되었습니다.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        // JPA에서는 save 쓰지 않아도 DB에 반영됨
        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
    }

    public MypageResponse getMyInfo(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        List<GameRecordResponse> records =
                user.getGameRecords()
                        .stream()
                        .map(record -> GameRecordResponse.builder()
                                .id(record.getId())
                                .gameName(record.getGameName())
                                .score(record.getScore())
                                .build())
                        .toList();

        return MypageResponse.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .gameRecords(records)
                .build();
    }

    @Transactional
    public MypageResponse updateUser(
            String email,
            String nickname,
            MultipartFile profileImage
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        // 닉네임 중복 체크
        if (!user.getNickname().equals(nickname)
                && userRepository.existsByNickname(nickname)) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        user.changeNickname(nickname);
        // 프로필 이미지 변경
        if (profileImage != null && !profileImage.isEmpty()) {
            if (user.getProfileImage() != null
                    && user.getProfileImage().startsWith("https://d2uftzitv8h5w8.cloudfront.net/")
                    && !user.getProfileImage().contains("default-profile.png")) {

                s3Service.delete(user.getProfileImage());
            }

            String imageUrl =
                    s3Service.upload(profileImage);

            user.changeProfileImage(imageUrl);
        }

        return MypageResponse.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
            .build();
    }

    @Transactional
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        // 프로필 이미지가 있으면 S3에서도 삭제, S3 삭제 실패해도 회원 삭제 성공
        try {
            if (user.getProfileImage() != null
                && user.getProfileImage().startsWith("https://d2uftzitv8h5w8.cloudfront.net/")
                && !user.getProfileImage().contains("default-profile.png")) {

                s3Service.delete(user.getProfileImage());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // DB에서 JPA로 유저 삭제
        userRepository.delete(user);
    }
}
