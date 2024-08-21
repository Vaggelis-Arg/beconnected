package com.beconnected.controller;

import com.beconnected.model.Message;
import com.beconnected.model.User;
import com.beconnected.service.JwtService;
import com.beconnected.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final JwtService jwtService;

    @GetMapping("/chattedUsers")
    public ResponseEntity<List<User>> getChattedUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Long userId = jwtService.extractUserId(token);
        List<User> chattedUsers = messageService.getChattedUsers(userId);
        return ResponseEntity.ok(chattedUsers);
    }


    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestHeader("Authorization") String authHeader,
                                               @RequestParam Long receiverId,
                                               @RequestParam String content) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Long senderId = jwtService.extractUserId(token);
        Message message = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(@RequestHeader("Authorization") String authHeader,
                                                         @PathVariable Long userId) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Long currentUserId = jwtService.extractUserId(token);
        List<Message> messages = messageService.getMessagesBetweenUsers(currentUserId, userId);
        return ResponseEntity.ok(messages);
    }
}
