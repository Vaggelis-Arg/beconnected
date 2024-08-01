package com.beconnected.repository;

import com.beconnected.model.Connection;
import com.beconnected.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    List<Connection> findByFollowed(User followed);

    List<Connection> findByFollowing(User following);

    Optional<Connection> findByFollowedAndFollowing(User followed, User following);

    boolean existsByFollowedAndFollowing(User followed, User following);
}
