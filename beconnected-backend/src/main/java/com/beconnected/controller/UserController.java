package com.beconnected.controller;


import com.beconnected.model.User;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("{userId}/follow")
    public void followUser(@PathVariable Long userId, @RequestParam Long followedUserId) {
        User follower = userService.findById(followedUserId);
        User followed = userService.findById(followedUserId);
        userService.followUser(follower, followed);
    }

    @PostMapping("/{userId}/unfollow")
    public void unfollowUser(@PathVariable Long userId, @RequestParam Long followedUserId) {
        User follower = userService.findById(followedUserId);
        User followed = userService.findById(followedUserId);
        userService.unfollowUser(follower, followed);
    }

    @GetMapping("/{userId}/following")
    public List<User> getFollowing(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return userService.getFollowing(user);
    }

    @GetMapping("/{userId}/followers")
    public List<User> getFollowers(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return userService.getFollowers(user);
    }
}
