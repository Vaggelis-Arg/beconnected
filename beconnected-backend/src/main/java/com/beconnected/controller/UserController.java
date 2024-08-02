package com.beconnected.controller;


import com.beconnected.model.User;
import com.beconnected.service.JwtService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }


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

    @GetMapping("/{userId}/connections")
    public ResponseEntity<List<User>> getConnections(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<User> following = userService.getFollowing(user);
        List<User> followers = userService.getFollowers(user);

        // Find mutual followers
        Set<User> mutualFollowers = new HashSet<>(following);
        mutualFollowers.retainAll(followers);

        return ResponseEntity.ok(new ArrayList<>(mutualFollowers));
    }
}
