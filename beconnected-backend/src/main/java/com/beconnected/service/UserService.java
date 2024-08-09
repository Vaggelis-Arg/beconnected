package com.beconnected.service;

import com.beconnected.model.Connection;
import com.beconnected.model.Picture;
import com.beconnected.model.User;
import com.beconnected.repository.ConnectionRepository;
import com.beconnected.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        return userRepository.findByUsername(usernameOrEmail).orElseGet(() -> userRepository.findByEmail(usernameOrEmail).orElseThrow(() -> new UsernameNotFoundException("Username/Email" + usernameOrEmail + "does not exist")));
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateUsername(Long userId, String newUsername) {
        if (userRepository.findByUsername(newUsername).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        User user = findById(userId);
        user.setUsername(newUsername);
        userRepository.save(user);
    }

    public void updateEmail(Long userId, String newEmail) {
        if (userRepository.findByEmail(newEmail).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = findById(userId);
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public void updatePassword(Long userId, String newPassword) {
        User user = findById(userId);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<User> searchUsers(String query, Long currentUserId) {
        return userRepository.searchUsers(query, currentUserId);
    }

    @Transactional
    public void followUser(User followed, User following) {
        if (!connectionRepository.existsByFollowedAndFollowing(followed, following)) {
            Connection connection = new Connection();
            connection.setFollowed(followed);
            connection.setFollowing(following);
            connectionRepository.save(connection);
        }
    }

    @Transactional
    public void unfollowUser(User followed, User following) {
        Connection connection = connectionRepository.findByFollowedAndFollowing(followed, following)
                .orElseThrow(() -> new RuntimeException("Follow relationship does not exist"));
        connectionRepository.delete(connection);
    }

    public List<User> getFollowing(User user) {
        List<Connection> follows = connectionRepository.findByFollowed(user);
        return follows.stream().map(Connection::getFollowing).toList();
    }

    public List<User> getFollowers(User user) {
        List<Connection> follows = connectionRepository.findByFollowing(user);
        return follows.stream()
                .map(Connection::getFollowed)
                .toList();
    }

    public void updateProfilePicture(User user, MultipartFile file) throws IOException {
        if (user == null || file == null) {
            throw new IllegalArgumentException("User or file cannot be null");
        }

        Picture picture = new Picture();
        picture.setFileName(file.getOriginalFilename());
        picture.setContentType(file.getContentType());
        picture.setImageData(file.getBytes());

        user.setProfilePicture(picture);
        userRepository.save(user);
    }


    public void deleteProfilePicture(User user) {
        user.setProfilePicture(null);
        userRepository.save(user);
    }
}
