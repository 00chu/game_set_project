package com.test.game_set_back.common.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
// AWS S3 클라이언트를 Spring Bean으로 등록하는 설정 클래스
// 파일 업로드/다운로드 기능을 위해 S3랑 연결해주는 핵심 설정
public class S3Config { 

    // AWS 설정 값 주입
    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    // 다른 서비스에서 자동 주입 가능하도록 Spring Bean으로 등록
    @Bean
    public S3Client s3Client() {
        // AWS 인증 정보 객체 생성
        AwsBasicCredentials credentials =
                AwsBasicCredentials.create(
                        accessKey,
                        secretKey
                );

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider( // 고정된 AWS 키 사용하는 인증 방식으로 설정
                        StaticCredentialsProvider.create(credentials)
                )
                .build();
    }
}