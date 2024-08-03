package com.beconnected.controller;

import com.beconnected.model.FeedItem;
import com.beconnected.service.FeedService;
import com.beconnected.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FeedController {

    private final FeedService feedService;
    private final JwtService jwtService;

    // Inject the FeedService into the controller
    public FeedController(FeedService feedService, JwtService jwtService) {
        this.feedService = feedService;
        this.jwtService = jwtService;
    }

    @GetMapping("/feed")
    public ResponseEntity<List<FeedItem>> getFeed(@RequestHeader("Authorization") String authHeader) {
        System.out.println("Accessing feed.");

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Long userId = jwtService.extractUserId(token);
        List<FeedItem> userFeed = feedService.getUserFeed(userId);

        return ResponseEntity.ok(userFeed);
    }
}
