package com.test.game_set_back.game.repository;

import com.test.game_set_back.game.entity.GameRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRecordRepository
        extends JpaRepository<GameRecord, Long> {

    List<GameRecord> findByGameName(String gameName);

    List<GameRecord> findByUserIdOrderByScoreDesc(Long userId);

    List<GameRecord> findByGameNameOrderByScoreDesc(String gameName);
}
