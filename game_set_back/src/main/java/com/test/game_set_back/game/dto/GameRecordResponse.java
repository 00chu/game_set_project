package com.test.game_set_back.game.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameRecordResponse {
    private Long id;
    private String nickname;
    private Integer score;
}