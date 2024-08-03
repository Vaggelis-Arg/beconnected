package com.beconnected.repository;

import com.beconnected.model.Message;
import com.beconnected.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT DISTINCT CASE WHEN m.sender.userId = :userId THEN m.receiver.userId ELSE m.sender.userId END " +
            "FROM Message m " +
            "WHERE m.sender.userId = :userId OR m.receiver.userId = :userId")
    List<Long> findChattedUserIds(@Param("userId") Long userId);

    List<Message> findBySenderAndReceiver(User sender, User receiver);

    List<Message> findByReceiver(User receiver);

    List<Message> findBySender(User sender);
}