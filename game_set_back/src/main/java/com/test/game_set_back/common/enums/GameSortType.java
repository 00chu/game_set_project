package com.test.game_set_back.common.enums;

public enum GameSortType {

    BASEBALL_ASC(false),
    COLOR_MATCH_DESC(true);

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