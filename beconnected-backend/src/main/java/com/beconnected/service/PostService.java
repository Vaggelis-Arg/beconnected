package com.beconnected.service;

import com.beconnected.model.Comment;
import com.beconnected.model.Like;
import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private NotificationService notificationService;

    public Post createPost(String textContent, byte[] mediaContent, String mediaType, User author) {
        Post post = new Post(textContent, mediaContent, mediaType, author);
        return postRepository.save(post);
    }

    public Post findById(Long postId) {
        return postRepository.findById(postId).orElse(null);
    }

    public List<Post> getPostsByAuthor(Long authorId) {
        return postRepository.findByAuthorUserIdOrderByCreatedAtDesc(authorId);
    }

    public List<Post> getPostsLikedByUser(Long userId) {
        List<Like> likes = likeRepository.findByUserUserId(userId);
        return likes.stream().map(Like::getPost).distinct().collect(Collectors.toList());
    }

    public List<Post> getPostsCommentedByUser(Long userId) {
        List<Comment> comments = commentRepository.findByUserUserId(userId);
        return comments.stream().map(Comment::getPost).distinct().collect(Collectors.toList());
    }

    // Return posts that users with userIds have posted, or commented, or liked
    public List<Post> getFeedForUser(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Post> authoredPosts = postRepository.findByAuthorInOrderByCreatedAtDesc(userIds);

        List<Post> likedPosts = likeRepository.findByUserUserIdIn(userIds).stream()
                .map(Like::getPost)
                .distinct()
                .collect(Collectors.toList());

        List<Post> commentedPosts = commentRepository.findByUserUserIdIn(userIds).stream()
                .map(Comment::getPost)
                .distinct()
                .collect(Collectors.toList());

        Set<Post> combinedPosts = new HashSet<>();
        combinedPosts.addAll(authoredPosts);
        combinedPosts.addAll(likedPosts);
        combinedPosts.addAll(commentedPosts);

        return combinedPosts.stream()
                .sorted(Comparator.comparing(Post::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }


    public void addComment(Long postId, String commentText, User user) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        Comment comment = new Comment(post, user, commentText);
        commentRepository.save(comment);

        notificationService.createCommentNotification(post.getAuthor(), post, comment);
    }

    public void likePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Optional<Like> existingLike = likeRepository.findByPostPostIdAndUserUserId(postId, user.getUserId());

        if (existingLike.isPresent()) {
            throw new RuntimeException("User has already liked this post");
        }

        Like like = new Like(post, user);
        likeRepository.save(like);

        notificationService.createLikeNotification(post.getAuthor(), post, like);
    }


    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostPostId(postId);
    }

    public List<Like> getLikesByPostId(Long postId) {
        return likeRepository.findByPostPostId(postId);
    }

    public void removeLike(Long postId, User user) {
        Like like = likeRepository.findByPostPostIdAndUserUserId(postId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Like not found"));

        likeRepository.delete(like);
    }

    public void removeComment(Long postId, Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().equals(user) || !comment.getPost().getPostId().equals(postId)) {
            throw new RuntimeException("User not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }


}
