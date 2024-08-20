package com.beconnected.controller;


import com.beconnected.model.Picture;
import com.beconnected.model.User;
import com.beconnected.service.JwtService;
import com.beconnected.service.PictureService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PictureService pictureService;

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

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("query") String query, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        Long currentUserId = jwtService.extractUserId(token);

        List<User> users = userService.searchUsers(query, currentUserId);

        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody User updatedUser, @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        try {
            User existingUser = userService.findById(userId);
            if (existingUser == null) {
                return ResponseEntity.notFound().build();
            }

            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setBio(updatedUser.getBio());
            existingUser.setExperience(updatedUser.getExperience());
            existingUser.setEducation(updatedUser.getEducation());
            existingUser.setSkills(updatedUser.getSkills());

            userService.save(existingUser);

            return ResponseEntity.ok(existingUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/me/username")
    public ResponseEntity<String> updateUsername(@RequestHeader("Authorization") String authHeader, @RequestParam String newUsername) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            userService.updateUsername(userId, newUsername);
            return ResponseEntity.ok("Username updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/me/email")
    public ResponseEntity<String> updateEmail(@RequestHeader("Authorization") String authHeader, @RequestParam String newEmail) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            userService.updateEmail(userId, newEmail);
            return ResponseEntity.ok("Email updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@RequestHeader("Authorization") String authHeader, @RequestParam String newPassword) {
        Long userId = extractUserIdFromToken(authHeader);
        userService.updatePassword(userId, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/me/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestHeader("Authorization") String authHeader, @RequestParam("file") MultipartFile file) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            User user = userService.findById(userId);

            userService.updateProfilePicture(user, file);

            return ResponseEntity.ok("Profile picture uploaded successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile picture.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping("/{userId}/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable Long userId, @RequestHeader("Authorization") String authHeader) {

        Long authenticatedUserId = extractUserIdFromToken(authHeader);

        User user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Picture picture = user.getProfilePicture();
        if (picture == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(picture.getContentType())).body(picture.getImageData());
    }


    @PutMapping("/me/profile-picture")
    public ResponseEntity<String> updateProfilePicture(@RequestHeader("Authorization") String authHeader, @RequestParam("file") MultipartFile file) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            User user = userService.findById(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty.");
            }

            userService.updateProfilePicture(user, file);

            return ResponseEntity.ok("Profile picture updated successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile picture.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/me/profile-picture")
    public ResponseEntity<String> deleteProfilePicture(@RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        User user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        Picture picture = user.getProfilePicture();
        if (picture == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found.");
        }

        // Remove picture association and delete using PictureService
        pictureService.deletePicture(picture.getPictureId());
        user.setProfilePicture(null);
        userService.save(user);

        return ResponseEntity.ok("Profile picture deleted successfully.");
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        return jwtService.extractUserId(token);
    }
}
