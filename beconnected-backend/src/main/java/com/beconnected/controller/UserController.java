package com.beconnected.controller;


import com.beconnected.model.User;
import com.beconnected.service.JwtService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("{followedUserId}/follow")
    public ResponseEntity<String> followUser(@PathVariable Long followedUserId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User follower = userService.findById(userId);
        User followed = userService.findById(followedUserId);
        if (follower == null || followed == null) {
            return ResponseEntity.notFound().build();
        }
        userService.followUser(followed, follower);
        return ResponseEntity.ok("Followed successfully.");
    }

    @PostMapping("/{followedUserId}/unfollow")
    public ResponseEntity<String> unfollowUser(@PathVariable Long followedUserId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User follower = userService.findById(userId);
        User followed = userService.findById(followedUserId);
        if (follower == null || followed == null) {
            return ResponseEntity.notFound().build();
        }
        userService.unfollowUser(followed, follower);
        return ResponseEntity.ok("Unfollowed successfully.");
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<User> following = userService.getFollowing(user);
        return ResponseEntity.ok(following);
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<User> followers = userService.getFollowers(user);
        return ResponseEntity.ok(followers);
    }
}
