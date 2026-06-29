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

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile file) {
        try {
            String fileName =
                "profile/" +
                UUID.randomUUID() +
                "_" +
                file.getOriginalFilename();

            PutObjectRequest request =
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build();

            s3Client.putObject(
                    request,
                    RequestBody.fromBytes(file.getBytes())
            );

            return String.format(
                    "https://d2uftzitv8h5w8.cloudfront.net/%s",
                    fileName
            );

        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }

    public void delete(String imageUrl) {

        String key = imageUrl.substring(
                imageUrl.indexOf(".com/") + 5
        );

        DeleteObjectRequest request =
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build();

        s3Client.deleteObject(request);
    }
}