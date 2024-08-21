package com.beconnected.controller;

import com.beconnected.model.Connection;
import com.beconnected.model.User;
import com.beconnected.service.ConnectionService;
import com.beconnected.service.JwtService;
import com.beconnected.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;
    private final UserService userService;
    private final JwtService jwtService;

    public ConnectionController(ConnectionService connectionService, UserService userService, JwtService jwtService) {
        this.connectionService = connectionService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/{requestedUserId}/request")
    public ResponseEntity<String> requestConnection(@PathVariable Long requestedUserId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User requestingUser = userService.findById(userId);
        User requestedUser = userService.findById(requestedUserId);
        if (requestingUser == null || requestedUser == null) {
            return ResponseEntity.notFound().build();
        }
        connectionService.requestConnection(requestedUser, requestingUser);
        return ResponseEntity.ok("Connection request sent successfully.");
    }

    @PostMapping("/{requestingUserId}/accept")
    public ResponseEntity<String> acceptConnection(@PathVariable Long requestingUserId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User requestedUser = userService.findById(userId);
        User requestingUser = userService.findById(requestingUserId);
        if (requestedUser == null || requestingUser == null) {
            return ResponseEntity.notFound().build();
        }
        connectionService.acceptConnection(requestedUser, requestingUser);
        return ResponseEntity.ok("Connection request accepted.");
    }

    @PostMapping("/{requestingUserId}/decline")
    public ResponseEntity<String> declineConnection(@PathVariable Long requestingUserId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User requestedUser = userService.findById(userId);
        User requestingUser = userService.findById(requestingUserId);
        if (requestedUser == null || requestingUser == null) {
            return ResponseEntity.notFound().build();
        }
        connectionService.declineConnection(requestedUser, requestingUser);
        return ResponseEntity.ok("Connection request declined.");
    }

    @GetMapping("/{userId}/connections")
    public ResponseEntity<List<User>> getConnections(@PathVariable Long userId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long requestingUserId = jwtService.extractUserId(token);

        User requestingUser = userService.findById(requestingUserId);
        User targetUser = userService.findById(userId);

        List<User> connections = connectionService.getConnections(targetUser);
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/{userId}/received-pending-requests")
    public ResponseEntity<List<Connection>> getReceivedPendingRequests(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Connection> pendingRequests = connectionService.getReceivedPendingRequests(user);
        return ResponseEntity.ok(pendingRequests);
    }

    @PostMapping("/{userId}/remove")
    public ResponseEntity<String> removeConnection(@PathVariable Long userId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long currentUserId = jwtService.extractUserId(token);

        User currentUser = userService.findById(currentUserId);
        User targetUser = userService.findById(userId);

        if (currentUser == null || targetUser == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            connectionService.removeConnection(currentUser, targetUser);
            return ResponseEntity.ok("Connection removed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
