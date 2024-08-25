package com.beconnected.configuration;

import com.beconnected.model.*;
import com.beconnected.repository.*;
import com.beconnected.service.AuthenticationService;
import com.beconnected.service.PostService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@AllArgsConstructor
@Component
public class DataInitializer implements CommandLineRunner {

    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ConnectionRepository connectionRepository;
    private final MessageRepository messageRepository;
    private final JobRepository jobRepository;
    private final UserService userService;
    private final PostService postService;

    @Override
    public void run(String... args) throws Exception {
        if (authenticationService.getAdmin() == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@example.com");
            admin.setPhone("1234567890");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setMemberSince(LocalDate.now());
            admin.setUserRole(UserRole.ADMIN);
            admin.setEnabled(true);
            admin.setLocked(false);

            authenticationService.saveUser(admin);
        }

        if (userRepository.count() == 1) { // If there is only the admin registered
            byte[] pic1Data = loadMediaFromFile("./assets/profile1.jpg");
            byte[] pic2Data = loadMediaFromFile("./assets/profile2.png");

            Picture pic1 = new Picture(null, pic1Data, "profile1.jpg", "image/jpeg");
            Picture pic2 = new Picture(null, pic2Data, "profile2.jpg", "image/jpeg");

            User user1 = new User("mikesmith", "Mike", "Smith", "smithmike@example.com", "1234567890", passwordEncoder.encode("password1"),
                    LocalDate.now(), UserRole.USER, false, true, pic1, "Worked as a Software Engineer for 12 years in big companies",
                    Set.of("Java Developer", "Python developer", "Cyber Security"), Set.of("MIT"), Set.of("Java", "Spring Boot", "C++"));

            User user2 = new User("janerobbie", "Jane", "Robbie", "jane@example.com", "0987654321", passwordEncoder.encode("password2"),
                    LocalDate.now(), UserRole.USER, false, true, pic2, "Student at Harvard Business School. I have already worked as a Product Manager at Google and I am looking for a job at high finance.",
                    Set.of("Product Manager"), Set.of("Harvard"), Set.of("Management", "Leadership"));

            userService.save(user1);
            userService.save(user2);

            byte[] media1Data = loadMediaFromFile("./assets/media1.jpg");
            byte[] media2Data = loadMediaFromFile("./assets/media2.mp4");

            Post post1 = new Post("I'm thrilled to announce my new software engineering position in microsoft", media1Data, "image/jpeg", user1);
            Post post2 = new Post("Incredible speech from Warren Buffett. Very useful", media2Data, "video/mp4", user2);

            postRepository.save(post1);
            postRepository.save(post2);

            postService.likePost(post1.getPostId(), user2);
            postService.likePost(post2.getPostId(), user1);

            postService.addComment(post1.getPostId(), "Great post!", user2);
            postService.addComment(post2.getPostId(), "Nice video!", user1);

            Connection connection1 = new Connection(null, user1, user2, ConnectionStatus.ACCEPTED, LocalDate.now());

            connectionRepository.save(connection1);

            Message message1 = new Message(user1, user2, "Hello Jane!");
            Message message2 = new Message(user2, user1, "Hi Mike!");

            messageRepository.save(message1);
            messageRepository.save(message2);

            Job job1 = new Job("Java Developer", "Looking for a Java developer", user1,
                    LocalDateTime.now(), true);
            Job job2 = new Job("Product Manager", "Looking for a Product Manager", user2,
                    LocalDateTime.now(), true);

            jobRepository.save(job1);
            jobRepository.save(job2);
        }
    }

    private byte[] loadMediaFromFile(String path) throws IOException {
        File file = new File(path);
        return Files.readAllBytes(file.toPath());
    }
}