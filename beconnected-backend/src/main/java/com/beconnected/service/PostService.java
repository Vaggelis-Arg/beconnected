package com.beconnected.service;

import com.beconnected.model.Comment;
import com.beconnected.model.Like;
import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.repository.*;
import com.beconnected.utilities.MatrixFactorization;
import org.apache.commons.text.similarity.LevenshteinDistance;
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
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MatrixFactorization matrixFactorization;

    @Autowired
    private UserRepository userRepository;

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

    public List<Post> getFeedForUser(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Post> authoredPosts = postRepository.findByAuthorInOrderByCreatedAtDesc(userIds);
        List<Post> likedPosts = likeRepository.findByUserUserIdIn(userIds).stream()
                .map(Like::getPost)
                .distinct()
                .toList();
        List<Post> commentedPosts = commentRepository.findByUserUserIdIn(userIds).stream()
                .map(Comment::getPost)
                .distinct()
                .toList();

        Set<Post> combinedPosts = new HashSet<>();
        combinedPosts.addAll(authoredPosts);
        combinedPosts.addAll(likedPosts);
        combinedPosts.addAll(commentedPosts);

        List<Post> recommendedPosts = new ArrayList<>();
        for (Long userId : userIds) {
            userRepository.findById(userId).ifPresent(user -> recommendedPosts.addAll(recommendPosts(user)));
        }

        return recommendedPosts.stream()
                .filter(combinedPosts::contains)
                .distinct()
                .collect(Collectors.toList());
    }

    public void addComment(Long postId, String commentText, User user) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        Comment comment = new Comment(post, user, commentText);
        commentRepository.save(comment);

        notificationService.createCommentNotification(post.getAuthor(), user, post, comment);
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

        notificationService.createLikeNotification(post.getAuthor(), user, post, like);
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

    public void deletePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        if (!post.getAuthor().equals(user)) {
            throw new RuntimeException("User not authorized to delete this post");
        }

        notificationRepository.deleteAll(notificationRepository.findByPost(post));

        likeRepository.deleteAll(likeRepository.findByPostPostId(postId));
        commentRepository.deleteAll(commentRepository.findByPostPostId(postId));

        postRepository.delete(post);
    }

    public double calculateMatchScore(User user, Post post) {
        Set<String> userSkills = user.getSkills().stream()
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        String userBio = (user.getBio() != null) ? user.getBio().toLowerCase() : "";
        String postContent = (post.getTextContent() != null) ? post.getTextContent().toLowerCase() : "";

        if ((userSkills.isEmpty() && userBio.isEmpty()) || postContent.isEmpty()) {
            return 0.0;
        }

        Set<String> termsToMatch = new HashSet<>(userSkills);
        if (!userBio.isEmpty()) {
            termsToMatch.add(userBio);
        }

        double totalSimilarity = 0.0;
        LevenshteinDistance levenshteinDistance = new LevenshteinDistance();

        for (String term : termsToMatch) {
            int distance = levenshteinDistance.apply(term, postContent);
            int maxLength = Math.max(term.length(), postContent.length());
            double similarity = 1.0 - ((double) distance / maxLength);
            totalSimilarity += similarity;
        }

        return totalSimilarity / termsToMatch.size();
    }

    public List<Post> recommendPosts(User user) {
        List<Post> allPosts = postRepository.findAll();
        List<Post> likedPosts = getPostsLikedByUser(user.getUserId());
        List<Post> commentedPosts = getPostsCommentedByUser(user.getUserId());

        Set<Post> interactedPosts = new HashSet<>();
        interactedPosts.addAll(likedPosts);
        interactedPosts.addAll(commentedPosts);

        Map<Post, Double> postScores = new HashMap<>();
        for (Post post : allPosts) {
            double matchScore = calculateMatchScore(user, post);

            if (interactedPosts.contains(post)) {
                matchScore /= 2.0;
            }

            postScores.put(post, matchScore);
        }

        double[][] scoreMatrix = buildScoreMatrix(user, allPosts);
        double[][] recommendations = matrixFactorization.factorization(scoreMatrix, 1000);

        for (int i = 0; i < recommendations[0].length; i++) {
            Post post = allPosts.get(i);
            double adjustedScore = recommendations[0][i] * 0.3 + 0.7 * postScores.getOrDefault(post, 0.0);
            postScores.put(post, adjustedScore);
        }

        return postScores.entrySet().stream()
                .sorted(Map.Entry.<Post, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private double[][] buildScoreMatrix(User user, List<Post> allPosts) {
        int numPosts = allPosts.size();
        double[][] scoreMatrix = new double[1][numPosts];

        for (int i = 0; i < numPosts; i++) {
            Post post = allPosts.get(i);
            scoreMatrix[0][i] = calculateMatchScore(user, post);
        }

        return scoreMatrix;
    }
}
