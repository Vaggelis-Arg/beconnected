package com.beconnected.service;

import com.beconnected.model.Connection;
import com.beconnected.model.User;
import com.beconnected.model.ConnectionStatus;
import com.beconnected.repository.ConnectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final NotificationService notificationService;

    public ConnectionService(ConnectionRepository connectionRepository, NotificationService notificationService) {
        this.connectionRepository = connectionRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public void requestConnection(User requestedUser, User requestingUser) {
        Optional<Connection> existingRequest = connectionRepository.findByRequestedUserAndRequestingUser(requestingUser, requestedUser);

        if (existingRequest.isPresent() && existingRequest.get().getStatus() == ConnectionStatus.PENDING) {
            Connection connection = existingRequest.get();
            connection.setStatus(ConnectionStatus.ACCEPTED);
            connectionRepository.save(connection);
            notificationService.deleteConnectionRequestNotification(connection);
        } else if (!connectionRepository.existsByRequestedUserAndRequestingUser(requestedUser, requestingUser)) {
            Connection connection = new Connection();
            connection.setRequestedUser(requestedUser);
            connection.setRequestingUser(requestingUser);
            connection.setStatus(ConnectionStatus.PENDING);
            connectionRepository.save(connection);
            notificationService.createConnectionRequestNotification(requestedUser, requestingUser, connection);
        }
    }

    @Transactional
    public void acceptConnection(User requestedUser, User requestingUser) {
        Connection connection = connectionRepository.findByRequestedUserAndRequestingUser(requestedUser, requestingUser)
                .orElseThrow(() -> new RuntimeException("Connection request does not exist"));
        connection.setStatus(ConnectionStatus.ACCEPTED);
        notificationService.deleteConnectionRequestNotification(connection);
        connectionRepository.save(connection);
    }

    @Transactional
    public void declineConnection(User requestedUser, User requestingUser) {
        Connection connection = connectionRepository.findByRequestedUserAndRequestingUser(requestedUser, requestingUser)
                .orElseThrow(() -> new RuntimeException("Connection request does not exist"));
        notificationService.deleteConnectionRequestNotification(connection);
        connectionRepository.delete(connection);
    }

    public List<User> getConnections(User user) {
        List<Connection> requestedConnections = connectionRepository.findByRequestedUserAndStatus(user, ConnectionStatus.ACCEPTED);

        List<Connection> requestingConnections = connectionRepository.findByRequestingUserAndStatus(user, ConnectionStatus.ACCEPTED);

        List<User> connections = new ArrayList<>();
        connections.addAll(requestedConnections.stream().map(Connection::getRequestingUser).toList());
        connections.addAll(requestingConnections.stream().map(Connection::getRequestedUser).toList());

        return connections;
    }

    public List<Connection> getReceivedPendingRequests(User user) {
        return connectionRepository.findByRequestedUserAndStatus(user, ConnectionStatus.PENDING);
    }

    @Transactional
    public void removeConnection(User user1, User user2) {
        Connection connection = connectionRepository.findByRequestedUserAndRequestingUser(user1, user2)
                .orElseGet(() -> connectionRepository.findByRequestedUserAndRequestingUser(user2, user1)
                        .orElseThrow(() -> new RuntimeException("Connection does not exist")));
        notificationService.deleteConnectionRequestNotification(connection);
        connectionRepository.delete(connection);
    }
}
