package com.beconnected.controller;

import com.beconnected.model.Notification;
import com.beconnected.model.User;
import com.beconnected.service.JwtService;
import com.beconnected.service.NotificationService;
import com.beconnected.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService, JwtService jwtService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/connections")
    public ResponseEntity<List<Notification>> getUserConnectionNotifications(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Notification> notifications = notificationService.getUserConnectionNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/likes-comments")
    public ResponseEntity<List<Notification>> getUserLikeAndCommentNotifications(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Notification> notifications = notificationService.getUserLikeAndCommentNotifications(user);
        return ResponseEntity.ok(notifications);
    }
}
