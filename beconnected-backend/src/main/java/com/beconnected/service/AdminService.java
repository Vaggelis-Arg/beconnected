package com.beconnected.service;

import com.beconnected.model.User;
import com.beconnected.model.UserRole;
import com.beconnected.repository.UserRepository;
import com.github.underscore.U;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostService postService;
    private final JobService jobService;
    private final ConnectionService connectionService;

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
                map.put(field.getName(), field.get(user));
            }

            map.put("postsByUser", postService.getPostsByAuthor(user.getUserId()));
            map.put("postsLikedByUser", postService.getPostsLikedByUser(user.getUserId()));
            map.put("postsCommentedByUser", postService.getPostsCommentedByUser(user.getUserId()));
            map.put("connections", connectionService.getConnections(user));
            map.put("jobsCreatedByUser", jobService.getJobsByUser(user.getUsername()));

        } catch (IllegalAccessException e) {
            logger.error("Failed to access object fields: {}", e.getMessage(), e);
            map.put("error", "Failed to access object fields: " + e.getMessage());
        }
        return map;
    }
}
