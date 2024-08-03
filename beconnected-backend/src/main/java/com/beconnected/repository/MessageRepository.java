package com.beconnected.repository;

import com.beconnected.model.Message;
import com.beconnected.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndReceiver(User sender, User receiver);

    List<Message> findByReceiver(User receiver);

    List<Message> findBySender(User sender);
}