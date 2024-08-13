package com.beconnected.controller;

import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.service.ConnectionService;
import com.beconnected.service.JwtService;
import com.beconnected.service.PostService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/feed")
public class FeedController {

    private final PostService postService;
    private final UserService userService;
    private final ConnectionService connectionService;
    private final JwtService jwtService;

    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(@RequestParam String textContent,
                                           @RequestParam(required = false) MultipartFile mediaFile,
                                           @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User author = userService.findById(userId);

        byte[] mediaContent = null;
        String mediaType = null;

        if (mediaFile != null && !mediaFile.isEmpty()) {
            try {
                mediaContent = mediaFile.getBytes();
                mediaType = mediaFile.getContentType();
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }
        }

        Post post = postService.createPost(textContent, mediaContent, mediaType, author);
        return ResponseEntity.ok(post);
    }


    @GetMapping("/posts/author/{authorId}")
    public ResponseEntity<List<Post>> getPostsByAuthor(@PathVariable Long authorId) {
        List<Post> posts = postService.getPostsByAuthor(authorId);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/posts/liked/{userId}")
    public ResponseEntity<List<Post>> getPostsLikedByUser(@PathVariable Long userId) {
        List<Post> posts = postService.getPostsLikedByUser(userId);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/me")
    public ResponseEntity<List<Post>> getFeedForCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User currentUser = userService.findById(userId);
        List<User> connections = connectionService.getConnections(currentUser);

        List<Long> authorIds = connections.stream()
                .map(User::getUserId)
                .collect(Collectors.toList());
        authorIds.add(currentUser.getUserId());

        List<Post> feed = postService.getFeedForUser(authorIds);
        return ResponseEntity.ok(feed);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<String> addComment(@PathVariable Long postId,
                                             @RequestParam String comment,
                                             @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User currentUser = userService.findById(userId);

        postService.addComment(postId, comment);
        return ResponseEntity.ok("Comment added successfully");
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId,
                                           @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);

        postService.likePost(postId, user);
        return ResponseEntity.ok("Post liked successfully");
    }
}
