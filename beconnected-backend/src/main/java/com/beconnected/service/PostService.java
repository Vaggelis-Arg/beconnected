package com.beconnected.service;

import com.beconnected.model.Comment;
import com.beconnected.model.Like;
import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.repository.*;
import com.beconnected.utilities.MatrixFactorization;
import com.beconnected.utilities.PostScorePair;
import org.apache.commons.text.similarity.CosineSimilarity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    @Autowired
    private ConnectionService connectionService;

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

    public List<Post> getFeedForUser(User user) {
        List<User> connections = connectionService.getConnections(user);

        List<Long> authorIds = connections.stream()
                .map(User::getUserId)
                .collect(Collectors.toList());
        authorIds.add(user.getUserId());

        List<Post> authoredPosts = postRepository.findByAuthorInOrderByCreatedAtDesc(authorIds);
        List<Post> likedPosts = likeRepository.findByUserUserIdIn(authorIds).stream()
                .map(Like::getPost)
                .distinct()
                .toList();
        List<Post> commentedPosts = commentRepository.findByUserUserIdIn(authorIds).stream()
                .map(Comment::getPost)
                .distinct()
                .toList();

        Set<Post> combinedPosts = new HashSet<>();
        combinedPosts.addAll(authoredPosts);
        combinedPosts.addAll(likedPosts);
        combinedPosts.addAll(commentedPosts);

        return recommendPostsForUser(user, combinedPosts.stream().distinct().toList());
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

    private double calculateScore(User user, Post post) {
        CosineSimilarity cosineSimilarity = new CosineSimilarity();

        List<Post> commentedPosts = commentRepository.findByUserUserId(user.getUserId())
                .stream()
                .map(Comment::getPost)
                .distinct()
                .collect(Collectors.toList());

        List<Post> likedPosts = likeRepository.findByUserUserId(user.getUserId())
                .stream()
                .map(Like::getPost)
                .distinct()
                .collect(Collectors.toList());

        String interactedPostsText = Stream.concat(commentedPosts.stream(), likedPosts.stream())
                .map(post1 -> post1.getTextContent() != null ? post1.getTextContent().toLowerCase() : "")
                .collect(Collectors.joining(" "));

        String userBio = user.getBio() != null ? user.getBio().toLowerCase() : "";
        String userSkillsStr = String.join(" ", user.getSkills()).toLowerCase();
        String userProfileText = userBio + " " + userSkillsStr + " " + interactedPostsText;

        String postText = post.getTextContent() != null ? post.getTextContent().toLowerCase() : "";

        String[] userProfile = userProfileText.split("\\W+");
        String[] postProfile = postText.split("\\W+");

        Map<CharSequence, Integer> userProfileMap = Arrays.stream(userProfile)
                .collect(Collectors.toMap(word -> (CharSequence) word, word -> 1, Integer::sum));
        Map<CharSequence, Integer> postProfileMap = Arrays.stream(postProfile)
                .collect(Collectors.toMap(word -> (CharSequence) word, word -> 1, Integer::sum));

        double score = cosineSimilarity.cosineSimilarity(userProfileMap, postProfileMap);

        if (commentedPosts.contains(post) || likedPosts.contains(post)) {
            score /= 10;
        }

        return score;
    }



    public double[][] generateScoreMatrix(List<User> users, List<Post> posts) {
        int numUsers = users.size();
        int numPosts = posts.size();
        double[][] scoreMatrix = new double[numUsers][numPosts];

        for (int i = 0; i < numUsers; i++) {
            User user = users.get(i);
            for (int j = 0; j < numPosts; j++) {
                Post post = posts.get(j);
                scoreMatrix[i][j] = calculateScore(user, post);
            }
        }

        return scoreMatrix;
    }

    public List<Post> recommendPostsForUser(User user, List<Post> feedPosts) {
        List<User> users = List.of(user);

        double[][] scoreMatrix = generateScoreMatrix(users, feedPosts);
        double[][] predictedMatrix = matrixFactorization.factorization(scoreMatrix, 500);

        int userIndex = 0;
        List<PostScorePair> postScorePairs = new ArrayList<>();

        for (int j = 0; j < feedPosts.size(); j++) {
            postScorePairs.add(new PostScorePair(feedPosts.get(j), predictedMatrix[userIndex][j]));
        }

        postScorePairs.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        List<Post> recommendedPosts = postScorePairs.stream()
                .map(PostScorePair::getPost)
                .collect(Collectors.toList());

        return recommendedPosts;
    }
}
