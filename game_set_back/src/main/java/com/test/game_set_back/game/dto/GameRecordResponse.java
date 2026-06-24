package com.test.game_set_back.game.dto;

import com.test.game_set_back.common.enums.GameName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameRecordResponse {
    private Long id;
    private GameName gameName;
    private String nickname;
    private Integer score;
}