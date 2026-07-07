package com.test.game_set_back.user.dto;

import com.test.game_set_back.game.dto.GameRecordResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MypageResponse {

    private String email;

    private String nickname;

    private String profileImage;

    private List<GameRecordResponse> gameRecords;
}