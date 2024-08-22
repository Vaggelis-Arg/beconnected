package com.beconnected.controller;

import com.beconnected.model.User;
import com.beconnected.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/export")
    public ResponseEntity<String> exportUsersDataByIds(
            @RequestBody List<Long> userIds,
            @RequestParam(defaultValue = "json") String format) {
        try {
            String data = adminService.exportUsersDataByIds(userIds, format);
            return ResponseEntity.ok().body(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error exporting users data by IDs: " + e.getMessage());
        }
    }
}