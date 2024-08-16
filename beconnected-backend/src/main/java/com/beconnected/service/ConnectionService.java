package com.beconnected.service;

import com.beconnected.model.Connection;
import com.beconnected.model.User;
import com.beconnected.model.ConnectionStatus;
import com.beconnected.repository.ConnectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
        if (!connectionRepository.existsByRequestedUserAndRequestingUser(requestedUser, requestingUser)) {
            Connection connection = new Connection();
            connection.setRequestedUser(requestedUser);
            connection.setRequestingUser(requestingUser);
            connection.setStatus(ConnectionStatus.PENDING);
            connectionRepository.save(connection);
            notificationService.createConnectionRequestNotification(requestedUser, connection);
        }
    }

    @Transactional
    public void acceptConnection(User requestedUser, User requestingUser) {
        Connection connection = connectionRepository.findByRequestedUserAndRequestingUser(requestedUser, requestingUser)
                .orElseThrow(() -> new RuntimeException("Connection request does not exist"));
        connection.setStatus(ConnectionStatus.ACCEPTED);
        connectionRepository.save(connection);
    }

    @Transactional
    public void declineConnection(User requestedUser, User requestingUser) {
        Connection connection = connectionRepository.findByRequestedUserAndRequestingUser(requestedUser, requestingUser)
                .orElseThrow(() -> new RuntimeException("Connection request does not exist"));
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

    public boolean areUsersConnected(User user1, User user2) {
        boolean isUser1RequestingUser2 = connectionRepository.existsByRequestedUserAndRequestingUserAndStatus(user2, user1, ConnectionStatus.ACCEPTED);
        boolean isUser2RequestingUser1 = connectionRepository.existsByRequestedUserAndRequestingUserAndStatus(user1, user2, ConnectionStatus.ACCEPTED);
        return isUser1RequestingUser2 || isUser2RequestingUser1;
    }

    public List<Connection> getRequestedPendingRequests(User user) {
        return connectionRepository.findByRequestingUserAndStatus(user, ConnectionStatus.PENDING);
    }

    public List<Connection> getReceivedPendingRequests(User user) {
        return connectionRepository.findByRequestedUserAndStatus(user, ConnectionStatus.PENDING);
    }

    @Transactional
    public void removeConnection(User user1, User user2) {
        Connection connection = connectionRepository.findByRequestedUserAndRequestingUser(user1, user2)
                .orElseGet(() -> connectionRepository.findByRequestedUserAndRequestingUser(user2, user1)
                        .orElseThrow(() -> new RuntimeException("Connection does not exist")));
        connectionRepository.delete(connection);
    }
}
