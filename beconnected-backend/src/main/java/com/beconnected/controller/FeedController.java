package com.beconnected.controller;

import com.beconnected.model.Comment;
import com.beconnected.model.Like;
import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.service.ConnectionService;
import com.beconnected.service.JwtService;
import com.beconnected.service.PostService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/feed")
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

    @GetMapping("/me")
    public ResponseEntity<List<Post>> getFeedForCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User currentUser = userService.findById(userId);

        List<Post> feed = postService.getFeedForUser(currentUser);
        return ResponseEntity.ok(feed);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<String> addComment(@PathVariable Long postId,
                                             @RequestParam String comment,
                                             @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User currentUser = userService.findById(userId);

        postService.addComment(postId, comment, currentUser);
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

    @GetMapping("/posts/{postId}/media")
    public ResponseEntity<byte[]> getMediaPost(@PathVariable Long postId) {
        Post post = postService.findById(postId);

        if (post == null || post.getMediaContent() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        MediaType mediaType = MediaType.parseMediaType(post.getMediaType());
        return ResponseEntity.ok().contentType(mediaType).body(post.getMediaContent());
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        List<Comment> comments = postService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<List<Like>> getLikesByPost(@PathVariable Long postId) {
        List<Like> likes = postService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }

    @DeleteMapping("/posts/{postId}/like")
    public ResponseEntity<String> removeLike(@PathVariable Long postId,
                                             @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);

        postService.removeLike(postId, user);
        return ResponseEntity.ok("Like removed successfully");
    }

    @DeleteMapping("/posts/{postId}/comments/{commentId}")
    public ResponseEntity<String> removeComment(@PathVariable Long postId,
                                                @PathVariable Long commentId,
                                                @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);

        postService.removeComment(postId, commentId, user);
        return ResponseEntity.ok("Comment removed successfully");
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId,
                                             @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User user = userService.findById(userId);

        try {
            postService.deletePost(postId, user);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
