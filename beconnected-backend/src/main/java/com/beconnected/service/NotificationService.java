package com.beconnected.service;

import com.beconnected.model.Notification;
import com.beconnected.model.Connection;
import com.beconnected.model.Comment;
import com.beconnected.model.Like;
import com.beconnected.model.User;
import com.beconnected.model.Post;
import com.beconnected.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createConnectionRequestNotification(User recipientUser, User triggeredByUser, Connection connection) {
        Notification notification = new Notification();
        notification.setUser(recipientUser);
        notification.setTriggeredByUser(triggeredByUser);
        notification.setType(Notification.NotificationType.CONNECTION_REQUEST);
        notification.setConnection(connection);
        notificationRepository.save(notification);
    }

    public void createLikeNotification(User recipientUser, User triggeredByUser, Post post, Like like) {
        Notification notification = new Notification();
        notification.setUser(recipientUser);
        notification.setTriggeredByUser(triggeredByUser);
        notification.setType(Notification.NotificationType.LIKE);
        notification.setPost(post);
        notificationRepository.save(notification);
    }

    public void createCommentNotification(User recipientUser, User triggeredByUser, Post post, Comment comment) {
        Notification notification = new Notification();
        notification.setUser(recipientUser);
        notification.setTriggeredByUser(triggeredByUser);
        notification.setType(Notification.NotificationType.COMMENT);
        notification.setCommentMessage(comment.getCommentText());
        notification.setPost(post);
        notificationRepository.save(notification);
    }

    public void deleteConnectionRequestNotification(Connection connection) {
        List<Notification> notifications = notificationRepository.findByConnection(connection);
        notificationRepository.deleteAll(notifications);
    }

    public List<Notification> getUserConnectionNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(notification -> notification.getType() == Notification.NotificationType.CONNECTION_REQUEST)
                .collect(Collectors.toList());
    }

    public List<Notification> getUserLikeAndCommentNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(notification -> notification.getType() == Notification.NotificationType.LIKE ||
                        notification.getType() == Notification.NotificationType.COMMENT)
                .collect(Collectors.toList());
    }
}
