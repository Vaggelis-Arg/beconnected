package com.beconnected.repository;

import com.beconnected.model.Connection;
import com.beconnected.model.User;
import com.beconnected.model.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    List<Connection> findByRequestedUser(User requestedUser);

    List<Connection> findByRequestingUser(User requestingUser);

    List<Connection> findByRequestedUserAndStatus(User requestedUser, ConnectionStatus status);

    List<Connection> findByRequestingUserAndStatus(User requestingUser, ConnectionStatus connectionStatus);

    Optional<Connection> findByRequestedUserAndRequestingUser(User requestedUser, User requestingUser);

    boolean existsByRequestedUserAndRequestingUser(User requestedUser, User requestingUser);

    boolean existsByRequestedUserAndRequestingUserAndStatus(User requestedUser, User requestingUser, ConnectionStatus status);
}
