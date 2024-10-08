package com.beconnected.service;

import com.beconnected.model.Picture;
import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.repository.CommentRepository;
import com.beconnected.repository.UserRepository;
import com.github.underscore.U;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PostService postService;
    private final JobService jobService;
    private final ConnectionService connectionService;
    private final CommentRepository likeRepository;
    private final CommentRepository commentRepository;

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    public List<User> getAllUsers() {
        return userRepository.findAllExcludingAdmin();
    }

    public String exportUsersDataByIds(List<Long> userIds, String format) {
        try {
            List<User> users = userRepository.findAllById(userIds);

            if (users.isEmpty()) {
                throw new RuntimeException("No users found for the provided IDs");
            }

            List<Map<String, Object>> usersMapList = users.stream()
                    .map(this::convertUserToDetailedMap)
                    .collect(Collectors.toList());

            if ("json".equalsIgnoreCase(format)) {
                return U.toJson(usersMapList);
            } else if ("xml".equalsIgnoreCase(format)) {
                return U.toXml(usersMapList);
            } else {
                throw new IllegalArgumentException("Unsupported format: " + format);
            }
        } catch (Exception e) {
            logger.error("Error exporting users data by IDs: {}", e.getMessage(), e);
            return "Error exporting users data by IDs: " + e.getMessage();
        }
    }

    private Map<String, Object> convertUserToDetailedMap(User user) {
        Map<String, Object> map = new HashMap<>();
        try {
            Field[] fields = user.getClass().getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                Object value = field.get(user);

                if (field.getName().equals("profilePicture") && value instanceof Picture) {
                    map.put("profilePicture", getProfilePictureMap((Picture) value));
                } else {
                    map.put(field.getName(), value);
                }
            }

            List<Map<String, Object>> posts = postService.getPostsByAuthor(user.getUserId()).stream()
                    .map(post -> {
                        Map<String, Object> postMap = new HashMap<>();
                        postMap.put("postId", post.getPostId());
                        postMap.put("textContent", post.getTextContent());
                        postMap.put("mediaType", post.getMediaType());
                        postMap.put("createdAt", post.getCreatedAt());
                        return postMap;
                    }).collect(Collectors.toList());
            map.put("postsByUser", posts);

            List<Map<String, Object>> connections = connectionService.getConnections(user).stream()
                    .map(connectedUser -> {
                        Map<String, Object> connectionMap = new HashMap<>();
                        connectionMap.put("userId", connectedUser.getUserId());
                        connectionMap.put("username", connectedUser.getUsername());
                        connectionMap.put("firstName", connectedUser.getFirstName());
                        connectionMap.put("lastName", connectedUser.getLastName());
                        connectionMap.put("email", connectedUser.getEmail());
                        connectionMap.put("phone", connectedUser.getPhone());
                        connectionMap.put("profilePicture", getProfilePictureMap(connectedUser.getProfilePicture()));
                        return connectionMap;
                    }).collect(Collectors.toList());
            map.put("connections", connections);

            List<Map<String, Object>> jobs = jobService.getJobsByUser(user.getUsername()).stream()
                    .map(jobDTO -> {
                        Map<String, Object> jobMap = new HashMap<>();
                        jobMap.put("jobTitle", jobDTO.title());
                        jobMap.put("jobDescription", jobDTO.description());
                        return jobMap;
                    }).collect(Collectors.toList());
            map.put("jobsCreatedByUser", jobs);

            List<Map<String, Object>> likedPosts = likeRepository.findByUserUserId(user.getUserId()).stream()
                    .map(like -> {
                        Post post = like.getPost();
                        Map<String, Object> postMap = new HashMap<>();
                        postMap.put("postId", post.getPostId());
                        postMap.put("textContent", post.getTextContent());
                        postMap.put("createdAt", post.getCreatedAt());
                        return postMap;
                    }).collect(Collectors.toList());
            map.put("likedPosts", likedPosts);

            List<Map<String, Object>> commentedPosts = commentRepository.findByUserUserId(user.getUserId()).stream()
                    .map(comment -> {
                        Post post = comment.getPost();
                        Map<String, Object> postMap = new HashMap<>();
                        postMap.put("postId", post.getPostId());
                        postMap.put("textContent", post.getTextContent());
                        postMap.put("createdAt", post.getCreatedAt());
                        postMap.put("commentText", comment.getCommentText());
                        return postMap;
                    }).collect(Collectors.toList());
            map.put("commentedPosts", commentedPosts);

        } catch (IllegalAccessException e) {
            logger.error("Failed to access object fields: {}", e.getMessage(), e);
            map.put("error", "Failed to access object fields: " + e.getMessage());
        }
        return map;
    }

    private Map<String, Object> getProfilePictureMap(Picture picture) {
        if (picture != null) {
            Map<String, Object> pictureMap = new HashMap<>();
            pictureMap.put("pictureId", picture.getPictureId());
            pictureMap.put("fileName", picture.getFileName());
            pictureMap.put("contentType", picture.getContentType());
            return pictureMap;
        }
        return null;
    }
}
