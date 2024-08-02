package com.beconnected.service;

import com.beconnected.model.Connection;
import com.beconnected.model.User;
import com.beconnected.repository.ConnectionRepository;
import com.beconnected.repository.UserRepository;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        return userRepository.findByUsername(usernameOrEmail).orElseGet(() -> userRepository.findByEmail(usernameOrEmail).orElseThrow(() -> new UsernameNotFoundException("Username/Email" + usernameOrEmail + "does not exist")));
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
}
