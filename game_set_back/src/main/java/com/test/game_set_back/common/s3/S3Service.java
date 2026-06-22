package com.test.game_set_back.common.s3;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

@Service
public class S3Service {
    public String upload(MultipartFile file) {
        // 1. S3 버킷에 파일 업로드
        // 2. 업로드된 이미지 URL 반환
        return null;
    }

    public void delete(String imageUrl) {
        // S3에서 이미지 삭제
    }
}