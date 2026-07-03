package com.test.game_set_back.common.enums;

import lombok.Getter;

@Getter
public enum GameSortType {
    BASEBALL(false),     // 적을수록 좋음
    COLOR_MATCH(true),   // 높을수록 좋음
    HANGMAN(true);       // 남은 목숨 많을수록 좋음

    private final boolean desc;

    GameSortType(boolean desc) {
        this.desc = desc;
    }

    public boolean isDesc() {
        return desc;
    }

    public static GameSortType from(String gameName) {
        return GameSortType.valueOf(gameName);
    }
}