package com.test.game_set_back.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.UUID;
import java.net.URI;

// 파일 저장을 위한 서비스 클래스
@Service
@RequiredArgsConstructor
public class S3Service {

    // Bean으로 등록된 S3Client 주입
    private final S3Client s3Client;

    // S3 저장 공간 이름
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile file) {
        try {
            // 파일 이름을 생성하는 로직
            // 폴더명 + 파일 충돌 방지 랜덤 UUID + _ + 원본 파일명
            String fileName =
                "profile/" +
                UUID.randomUUID() +
                "_" +
                file.getOriginalFilename();

            // S3 업로드 요청 생성
            PutObjectRequest request =
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build();

            // 실제 업로드하는 부분. 실제 파일 바이너리를 S3으로 전송
            s3Client.putObject(
                    request,
                    RequestBody.fromBytes(file.getBytes())
            );

            // 저장된 파일의 CloudFront URL 반환
            return String.format(
                    "https://d2uftzitv8h5w8.cloudfront.net/%s",
                    fileName
            );

            /* CloudFront 사용하는 이유
            - S3 직접 접근보다 빠름
            - CDN 캐싱
            - 글로벌 성능 개선
            */
        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }

    // 파일의 CloudFront URL을 넣으면 S3에서 삭제
    public void delete(String imageUrl) {
        // URL을 S3 Key로 변환하는 부분
        String key = URI.create(imageUrl.replace(" ", "%20"))
                .getPath()
                .substring(1);

        // 삭제 요청을 생성하는 부분
        DeleteObjectRequest request =
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build();

        // 실제 삭제하는 부분
        s3Client.deleteObject(request);
    }
}