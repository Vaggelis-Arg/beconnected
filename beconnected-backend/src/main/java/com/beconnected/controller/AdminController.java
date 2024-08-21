package com.beconnected.controller;

import com.beconnected.model.User;
import com.beconnected.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = adminService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = adminService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}/export")
    public ResponseEntity<String> exportUserData(
            @PathVariable Long id,
            @RequestParam(defaultValue = "json") String format) {
        try {
            String data = adminService.exportUserData(id, format);
            return ResponseEntity.ok().body(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error exporting user data: " + e.getMessage());
        }
    }

    @GetMapping("/users/export")
    public ResponseEntity<String> exportAllUsersData(
            @RequestParam(defaultValue = "json") String format) {
        try {
            String data = adminService.exportAllUsersData(format);
            return ResponseEntity.ok().body(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error exporting users data: " + e.getMessage());
        }
    }
}