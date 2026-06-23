package com.test.game_set_back.game.controller;

import com.test.game_set_back.game.dto.GameRecordRequest;
import com.test.game_set_back.game.dto.GameRecordResponse;
import com.test.game_set_back.game.service.GameRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin("*")
@RequiredArgsConstructor
public class GameRecordController {
    @Autowired
    private GameRecordService gameService;

    @PostMapping("/record")
    public ResponseEntity<Void> saveRecord(
            Authentication authentication,
            @RequestBody GameRecordRequest request
    ) {
        String userId = authentication.getName();

        gameService.saveRecord(userId, request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/ranking/{gameName}")
    public ResponseEntity<List<GameRecordResponse>> getRanking(
            @PathVariable String gameName
    ) {
        return ResponseEntity.ok(gameService.getRanking(gameName));
    }
}
