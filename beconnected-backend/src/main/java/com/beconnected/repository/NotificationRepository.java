package com.beconnected.repository;

import com.beconnected.model.Connection;
import com.beconnected.model.Notification;
import com.beconnected.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByConnection(Connection connection);

}
