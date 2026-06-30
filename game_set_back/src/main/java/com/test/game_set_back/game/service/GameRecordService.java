package com.test.game_set_back.game.service;

import com.test.game_set_back.common.enums.GameName;
import com.test.game_set_back.common.enums.GameSortType;
import com.test.game_set_back.game.dto.GameRecordRequest;
import com.test.game_set_back.game.dto.GameRecordResponse;
import com.test.game_set_back.game.entity.GameRecord;
import com.test.game_set_back.game.repository.GameRecordRepository;
import com.test.game_set_back.user.entity.User;
import com.test.game_set_back.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@RequiredArgsConstructor // 생성자 주입을 위한 어노테이션
@Service
public class GameRecordService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRecordRepository gameRecordRepository;

    @Transactional
    public void saveRecord(
            String email,
            GameRecordRequest request
    ) {
        // JWT에서 나온 email 기반으로 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        GameRecord record = GameRecord.builder()
                .gameName(GameName.valueOf(request.getGameName()))
                .score(request.getScore())
                .playTime(request.getPlayTime())
                .user(user)
                .build();

        gameRecordRepository.save(record);
    }

    // 랭킹을 조회하는 메서드
    @Transactional
    public List<GameRecordResponse> getRanking(String gameName) {

        GameSortType sortType = GameSortType.from(gameName);

        // 특정 게임의 기록을 전부 가져옴
        List<GameRecord> records = gameRecordRepository.findByGameName(GameName.valueOf(gameName));

        // 데이터 없을 시 종료
        if (records.isEmpty()) {
            return List.of();
        }

        // 정렬 기준 default 는 점수 오름차순
        Comparator<GameRecord> comparator =
                Comparator.comparing(GameRecord::getScore);

        // DESC 처리
        if (sortType.isDesc()) {
            comparator = comparator.reversed();
        }

        return records.stream()
                .sorted(comparator)
                .map(r -> GameRecordResponse.builder()
                        .id(r.getId())
                        .gameName(r.getGameName())
                        .nickname(r.getUser().getNickname())
                        .score(r.getScore())
                        .build())
                .toList();
    }
}
