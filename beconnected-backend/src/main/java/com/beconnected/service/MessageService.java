package com.beconnected.service;

import com.beconnected.model.Message;
import com.beconnected.model.User;
import com.beconnected.repository.MessageRepository;
import com.beconnected.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<User> getChattedUsers(Long userId) {
        List<Long> sortedUserIds = messageRepository.findChattedUserIds(userId);

        List<User> users = userRepository.findAllById(sortedUserIds);

        return sortedUserIds.stream()
                .map(id -> users.stream().filter(user -> user.getUserId().equals(id)).findFirst().orElse(null))
                .collect(Collectors.toList());
    }

    @Transactional
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, content);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesBetweenUsers(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> messagesFromUser1ToUser2 = messageRepository.findBySenderAndReceiver(user1, user2);
        List<Message> messagesFromUser2ToUser1 = messageRepository.findBySenderAndReceiver(user2, user1);

        messagesFromUser1ToUser2.addAll(messagesFromUser2ToUser1);

        messagesFromUser1ToUser2.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));

        return messagesFromUser1ToUser2;
    }
}
