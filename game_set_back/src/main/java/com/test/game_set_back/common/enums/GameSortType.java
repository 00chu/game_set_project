package com.test.game_set_back.common.enums;

import lombok.Getter;

@Getter
public enum GameSortType {

    BASEBALL(false),
    COLOR_MATCH(true),
    HANGMAN(false);

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