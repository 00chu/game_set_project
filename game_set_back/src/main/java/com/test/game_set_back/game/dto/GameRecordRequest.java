package com.test.game_set_back.game.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameRecordRequest {
    private String gameName;
    private Integer score;
    private Integer playTime;
}
