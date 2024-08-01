package com.beconnected.controller;

import com.beconnected.model.FeedItem;
import com.beconnected.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FeedController {

    private final FeedService feedService;

    // Inject the FeedService into the controller
    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("{userId}/feed")
    public ResponseEntity<List<FeedItem>> getFeed(@PathVariable Long userId) {
        // Print to the console
        System.out.println("Accessing feed for user: " + userId);


        List<FeedItem> userFeed = feedService.getUserFeed(userId);

        return ResponseEntity.ok(userFeed);
    }
}
