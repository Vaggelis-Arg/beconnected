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
            byte[] pic1Data = loadMediaFromFile("./assets/profile1.png");
            byte[] pic2Data = loadMediaFromFile("./assets/profile2.png");
            byte[] pic3Data = loadMediaFromFile("./assets/profile3.png");
            byte[] pic4Data = loadMediaFromFile("./assets/profile4.png");
            byte[] pic5Data = loadMediaFromFile("./assets/profile5.png");
            byte[] pic6Data = loadMediaFromFile("./assets/profile6.png");
            byte[] pic7Data = loadMediaFromFile("./assets/profile7.png");
            byte[] pic8Data = loadMediaFromFile("./assets/profile8.png");
            byte[] pic9Data = loadMediaFromFile("./assets/profile9.png");
            byte[] pic10Data = loadMediaFromFile("./assets/profile10.png");
            byte[] pic11Data = loadMediaFromFile("./assets/profile11.png");
            byte[] pic12Data = loadMediaFromFile("./assets/profile12.png");
            byte[] pic13Data = loadMediaFromFile("./assets/profile13.png");
            byte[] pic14Data = loadMediaFromFile("./assets/profile14.png");
            byte[] pic15Data = loadMediaFromFile("./assets/profile15.png");

            Picture pic1 = new Picture(null, pic1Data, "profile1.png", "image/png");
            Picture pic2 = new Picture(null, pic2Data, "profile2.png", "image/png");
            Picture pic3 = new Picture(null, pic3Data, "profile3.png", "image/png");
            Picture pic4 = new Picture(null, pic4Data, "profile4.png", "image/png");
            Picture pic5 = new Picture(null, pic5Data, "profile5.png", "image/png");
            Picture pic6 = new Picture(null, pic6Data, "profile6.png", "image/png");
            Picture pic7 = new Picture(null, pic7Data, "profile7.png", "image/png");
            Picture pic8 = new Picture(null, pic8Data, "profile8.png", "image/png");
            Picture pic9 = new Picture(null, pic9Data, "profile9.png", "image/png");
            Picture pic10 = new Picture(null, pic10Data, "profile10.png", "image/png");
            Picture pic11 = new Picture(null, pic11Data, "profile11.png", "image/png");
            Picture pic12 = new Picture(null, pic12Data, "profile12.png", "image/png");
            Picture pic13 = new Picture(null, pic13Data, "profile13.png", "image/png");
            Picture pic14 = new Picture(null, pic14Data, "profile14.png", "image/png");
            Picture pic15 = new Picture(null, pic15Data, "profile15.png", "image/png");

            User user1 = new User("mike.smith", "Mike", "Smith", "smithmike@mail.com", "1234567890", passwordEncoder.encode("password1"),
                    LocalDate.now(), UserRole.USER, false, true, pic7, "Worked as a Software Engineer for 12 years in big companies",
                    Set.of("Java Developer", "Python developer", "Cyber Security"), Set.of("MIT"), Set.of("Java", "Spring Boot", "C++"));

            User user2 = new User("jane.james", "Jane", "James", "jane@mail.com", "0987654321", passwordEncoder.encode("password2"),
                    LocalDate.now(), UserRole.USER, false, true, pic1, "Student at Harvard Business School. I have already worked as a Product Manager at Google and I am looking for a job at high finance.",
                    Set.of("Product Manager"), Set.of("Harvard"), Set.of("Management", "Leadership"));

            User user3 = new User("nikos87", "Nikos", "Papadopoulos", "nikos.papa@mail.com", "1112223333", passwordEncoder.encode("password3"),
                    LocalDate.now(), UserRole.ADMIN, false, true, pic8, "Experienced IT Consultant specializing in Cloud Solutions and Data Security.",
                    Set.of("IT Consultant", "Cloud Architect"), Set.of("National Technical University of Athens"), Set.of("AWS", "Azure", "Cybersecurity"));

            User user4 = new User("elektra.k", "Elektra", "Kostopoulou", "elektra.k@mail.com", "2223334444", passwordEncoder.encode("password4"),
                    LocalDate.now(), UserRole.USER, false, true, pic2, "Graphic Designer with a passion for UX/UI. I have worked with top agencies in Athens.",
                    Set.of("Graphic Designer"), Set.of("Athens School of Fine Arts"), Set.of("Photoshop", "Illustrator", "Figma"));

            User user5 = new User("jason35", "Jason", "Bryant", "jason.b@mail.com", "3334445555", passwordEncoder.encode("password5"),
                    LocalDate.now(), UserRole.USER, false, true, pic9, "Marketing Specialist with a focus on digital campaigns and social media strategies.",
                    Set.of("Marketing Specialist"), Set.of("University of California, Berkeley"), Set.of("SEO", "Content Marketing", "Google Ads"));

            User user6 = new User("maria.r", "Maria", "Rossi", "maria.rossi@mail.com", "4445556666", passwordEncoder.encode("password6"),
                    LocalDate.now(), UserRole.USER, false, true, pic3, "Experienced Data Scientist passionate about Machine Learning and AI.",
                    Set.of("Data Scientist"), Set.of("Politecnico di Milano"), Set.of("Python", "R", "TensorFlow"));

            User user7 = new User("john.h", "John", "Harris", "john.harris@mail.com", "5556667777", passwordEncoder.encode("password7"),
                    LocalDate.now(), UserRole.USER, false, true, pic10, "Software Engineer specializing in mobile app development with 8 years of experience.",
                    Set.of("Mobile Developer"), Set.of("Tsinghua University"), Set.of("Java", "Kotlin", "Flutter"));

            User user8 = new User("elena.pap", "Elena", "Papandreou", "elena.pap@mail.com", "6667778888", passwordEncoder.encode("password8"),
                    LocalDate.now(), UserRole.USER, false, true, pic4, "Human Resources Manager with extensive experience in recruitment and talent management.",
                    Set.of("HR Manager"), Set.of("University of Athens"), Set.of("Recruitment", "Employee Relations", "Performance Management"));

            User user9 = new User("dimitrios.s", "Dimitrios", "Stefanidis", "dimitrios.stef@mail.com", "7778889999", passwordEncoder.encode("password9"),
                    LocalDate.now(), UserRole.USER, false, true, pic11, "Civil Engineer with a strong background in infrastructure projects.",
                    Set.of("Civil Engineer"), Set.of("Aristotle University of Thessaloniki"), Set.of("AutoCAD", "Project Management", "Structural Analysis"));

            User user10 = new User("anna.taylor", "Anna", "Taylor", "anna.taylor@mail.com", "8889990000", passwordEncoder.encode("password10"),
                    LocalDate.now(), UserRole.USER, false, true, pic5, "Content Writer with a love for storytelling and brand voice development.",
                    Set.of("Content Writer"), Set.of("University of Sydney"), Set.of("Copywriting", "SEO", "Creative Writing"));

            User user11 = new User("oliver.j", "Oliver", "Johnson", "oliver.j@mail.com", "9990001111", passwordEncoder.encode("password11"),
                    LocalDate.now(), UserRole.USER, false, true, pic12, "Business Analyst with a knack for data-driven decision making.",
                    Set.of("Business Analyst"), Set.of("London School of Economics"), Set.of("Data Analysis", "SQL", "Business Strategy"));

            User user12 = new User("sofia.g", "Sofia", "Garcia", "sofia.garcia@mail.com", "0001112222", passwordEncoder.encode("password12"),
                    LocalDate.now(), UserRole.USER, false, true, pic6, "UX Designer with a focus on creating user-centered designs.",
                    Set.of("UX Designer"), Set.of("University of Buenos Aires"), Set.of("User Research", "Wireframing", "Prototyping"));

            User user13 = new User("youssef.a", "Youssef", "Ahmed", "youssef.ahmed@mail.com", "1112223334", passwordEncoder.encode("password13"),
                    LocalDate.now(), UserRole.USER, false, true, pic13, "Network Engineer with a passion for building scalable networks.",
                    Set.of("Network Engineer"), Set.of("Cairo University"), Set.of("Cisco", "Networking", "Security"));

            User user14 = new User("jack.wood", "Jack", "Wood", "jack.wood@mail.com", "2223334445", passwordEncoder.encode("password14"),
                    LocalDate.now(), UserRole.USER, false, true, pic14, "Project Manager with a strong background in Agile methodologies.",
                    Set.of("Project Manager"), Set.of("University of Toronto"), Set.of("Agile", "Scrum", "Project Planning"));

            User user15 = new User("kostas.m", "Kostas", "Mantzaris", "kostas.mantz@mail.com", "3334445556", passwordEncoder.encode("password15"),
                    LocalDate.now(), UserRole.USER, false, true, pic15, "Electrical Engineer with experience in renewable energy solutions.",
                    Set.of("Electrical Engineer"), Set.of("University of Patras"), Set.of("Renewable Energy", "Circuit Design", "Power Systems"));

            userService.save(user1);
            userService.save(user2);
            userService.save(user3);
            userService.save(user4);
            userService.save(user5);
            userService.save(user6);
            userService.save(user7);
            userService.save(user8);
            userService.save(user9);
            userService.save(user10);
            userService.save(user11);
            userService.save(user12);
            userService.save(user13);
            userService.save(user14);
            userService.save(user15);

            Connection conn1 = new Connection(null, user1, user2, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn2 = new Connection(null, user1, user3, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn3 = new Connection(null, user1, user4, ConnectionStatus.PENDING, LocalDate.now());
            Connection conn4 = new Connection(null, user2, user5, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn5 = new Connection(null, user3, user6, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn6 = new Connection(null, user3, user7, ConnectionStatus.PENDING, LocalDate.now());
            Connection conn7 = new Connection(null, user4, user8, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn8 = new Connection(null, user5, user9, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn9 = new Connection(null, user6, user10, ConnectionStatus.PENDING, LocalDate.now());
            Connection conn10 = new Connection(null, user7, user11, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn11 = new Connection(null, user8, user12, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn12 = new Connection(null, user9, user13, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn13 = new Connection(null, user10, user14, ConnectionStatus.PENDING, LocalDate.now());
            Connection conn14 = new Connection(null, user11, user15, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn15 = new Connection(null, user12, user1, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn16 = new Connection(null, user13, user14, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn17 = new Connection(null, user13, user15, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn18 = new Connection(null, user14, user15, ConnectionStatus.PENDING, LocalDate.now());
            Connection conn19 = new Connection(null, user1, user5, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn20 = new Connection(null, user2, user6, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn21 = new Connection(null, user3, user8, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn22 = new Connection(null, user4, user9, ConnectionStatus.PENDING, LocalDate.now());
            Connection conn23 = new Connection(null, user5, user10, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn24 = new Connection(null, user6, user11, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn25 = new Connection(null, user7, user12, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn26 = new Connection(null, user8, user13, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn27 = new Connection(null, user9, user14, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn28 = new Connection(null, user10, user15, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn29 = new Connection(null, user11, user1, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn30 = new Connection(null, user12, user2, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn31 = new Connection(null, user1, user7, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn32 = new Connection(null, user9, user1, ConnectionStatus.ACCEPTED, LocalDate.now());

            connectionRepository.saveAll(Set.of(
                    conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8, conn9, conn10,
                    conn11, conn12, conn13, conn14, conn15, conn16, conn17, conn18, conn19, conn20,
                    conn21, conn22, conn23, conn24, conn25, conn26, conn27, conn28, conn29, conn30,
                    conn31, conn32
            ));


            byte[] media1Data = loadMediaFromFile("./assets/media1.png");
            byte[] media2Data = loadMediaFromFile("./assets/media2.mp4");
            byte[] media3Data = loadMediaFromFile("./assets/media3.png");
            byte[] media4Data = loadMediaFromFile("./assets/media4.png");
            byte[] media5Data = loadMediaFromFile("./assets/media5.jpg");
            byte[] media6Data = loadMediaFromFile("./assets/media6.png");
            byte[] media7Data = loadMediaFromFile("./assets/media7.jpg");
            byte[] media8Data = loadMediaFromFile("./assets/media8.mp4");
            byte[] media9Data = loadMediaFromFile("./assets/media9.jpg");
            byte[] media10Data = loadMediaFromFile("./assets/media10.mp4");
            byte[] media11Data = loadMediaFromFile("./assets/media11.jpg");
            byte[] media12Data = loadMediaFromFile("./assets/media12.jpg");
            byte[] media13Data = loadMediaFromFile("./assets/media13.png");

            Post post1 = new Post("I'm thrilled to announce my new software engineering position in Microsoft", media1Data, "image/png", user1);
            Post post2 = new Post("Incredible speech from Warren Buffett. Very useful", media2Data, "video/mp4", user2);
            Post post3 = new Post("Just finished a new project on mobile app development!", media3Data, "image/png", user7);
            Post post4 = new Post("Attended an amazing workshop on AI and Machine Learning today.", media12Data, "image/jpg", user4);
            Post post5 = new Post("Proud to have led our team to complete the infrastructure project ahead of schedule!", media5Data, "image/jpg", user9);
            Post post6 = new Post("New article published on data security in cloud computing.", media11Data, "image/jpg", user13);
            Post post7 = new Post("Check out the UX design I created for a new mobile app.", media13Data, "image/png", user12);
            Post post8 = new Post("Excited to be speaking at the upcoming marketing conference.", null, null, user5);
            Post post9 = new Post("What do you think about cycling robot?", media8Data, "video/mp4", user6);
            Post post10 = new Post("Had a great time at the university alumni meetup!", null, null, user10);
            Post post11 = new Post("Just started a new role as a network engineer.", null, null, user13);
            Post post12 = new Post("Are you interested in Business Analytics? Checkout my course!", media9Data, "image/jpg", user11);
            Post post13 = new Post("Finished designing a new branding concept for a client.", media4Data, "image/png", user4);
            Post post14 = new Post("Excited to be part of a groundbreaking AI project.", null, null, user14);
            Post post15 = new Post("Presenting at the international conference on human resources.", media6Data, "image/png", user8);
            Post post16 = new Post("Just attended a seminar about digital marketing", media7Data, "image/jpg", user5);
            Post post17 = new Post("Do you agree with Elon?", media10Data, "video/mp4", user2);

            postRepository.saveAll(Set.of(
                    post1, post2, post3, post4, post5, post6, post7, post8, post9, post10,
                    post11, post12, post13, post14, post15, post16, post17
            ));


            postService.likePost(post1.getPostId(), user10);
            postService.likePost(post1.getPostId(), user6);
            postService.likePost(post1.getPostId(), user2);
            postService.likePost(post2.getPostId(), user1);
            postService.likePost(post3.getPostId(), user1);
            postService.likePost(post3.getPostId(), user2);
            postService.likePost(post4.getPostId(), user5);
            postService.likePost(post4.getPostId(), user6);
            postService.likePost(post5.getPostId(), user7);
            postService.likePost(post5.getPostId(), user8);
            postService.likePost(post6.getPostId(), user4);
            postService.likePost(post6.getPostId(), user10);
            postService.likePost(post7.getPostId(), user11);
            postService.likePost(post7.getPostId(), user12);
            postService.likePost(post8.getPostId(), user9);
            postService.likePost(post8.getPostId(), user13);
            postService.likePost(post9.getPostId(), user14);
            postService.likePost(post9.getPostId(), user15);
            postService.likePost(post10.getPostId(), user1);
            postService.likePost(post10.getPostId(), user2);
            postService.likePost(post11.getPostId(), user3);
            postService.likePost(post11.getPostId(), user6);
            postService.likePost(post12.getPostId(), user7);
            postService.likePost(post12.getPostId(), user8);
            postService.likePost(post13.getPostId(), user9);
            postService.likePost(post13.getPostId(), user10);
            postService.likePost(post14.getPostId(), user11);
            postService.likePost(post14.getPostId(), user12);
            postService.likePost(post15.getPostId(), user13);
            postService.likePost(post15.getPostId(), user14);
            postService.likePost(post16.getPostId(), user15);
            postService.likePost(post16.getPostId(), user2);
            postService.likePost(post17.getPostId(), user1);
            postService.likePost(post17.getPostId(), user3);
            postService.likePost(post17.getPostId(), user4);
            postService.likePost(post17.getPostId(), user5);
            postService.likePost(post17.getPostId(), user6);

            postService.addComment(post1.getPostId(), "Great post!", user2);
            postService.addComment(post1.getPostId(), "Congrats!", user8);
            postService.addComment(post1.getPostId(), "Best of luck in your new position!", user6);
            postService.addComment(post2.getPostId(), "Nice video!", user1);
            postService.addComment(post3.getPostId(), "Awesome work on the mobile app!", user2);
            postService.addComment(post3.getPostId(), "Impressive development project!", user5);
            postService.addComment(post4.getPostId(), "Sounds like a great workshop!", user6);
            postService.addComment(post4.getPostId(), "AI and ML are the future!", user7);
            postService.addComment(post5.getPostId(), "Well done on the project completion!", user8);
            postService.addComment(post5.getPostId(), "Incredible achievement!", user9);
            postService.addComment(post6.getPostId(), "Interesting article on cloud security.", user10);
            postService.addComment(post6.getPostId(), "Very informative post!", user11);
            postService.addComment(post7.getPostId(), "Love the UX design!", user12);
            postService.addComment(post7.getPostId(), "Great design work!", user13);
            postService.addComment(post8.getPostId(), "Looking forward to your talk!", user14);
            postService.addComment(post8.getPostId(), "Wish I could attend the conference.", user15);
            postService.addComment(post9.getPostId(), "This is fascinating!", user1);
            postService.addComment(post9.getPostId(), "I agree, very cool!", user2);
            postService.addComment(post10.getPostId(), "Sounds like a fun event!", user3);
            postService.addComment(post10.getPostId(), "Glad you had a good time!", user4);
            postService.addComment(post11.getPostId(), "Congratulations on the new role!", user5);
            postService.addComment(post12.getPostId(), "Business analytics is crucial!", user7);
            postService.addComment(post12.getPostId(), "Great course, I'll check it out.", user8);
            postService.addComment(post13.getPostId(), "The branding concept looks amazing!", user9);
            postService.addComment(post13.getPostId(), "Fantastic design work!", user10);
            postService.addComment(post14.getPostId(), "Excited to hear more about this project!", user11);
            postService.addComment(post14.getPostId(), "Can't wait to see the results!", user12);
            postService.addComment(post15.getPostId(), "HR presentation sounds interesting.", user13);
            postService.addComment(post15.getPostId(), "Good luck with the presentation!", user14);
            postService.addComment(post16.getPostId(), "Digital marketing is key these days.", user15);
            postService.addComment(post16.getPostId(), "Nice seminar update!", user1);
            postService.addComment(post17.getPostId(), "Elon’s views are always thought-provoking.", user2);
            postService.addComment(post17.getPostId(), "Interesting perspective!", user3);
            postService.addComment(post17.getPostId(), "I agree with your take.", user4);
            postService.addComment(post17.getPostId(), "Great post about Elon!", user5);
            postService.addComment(post17.getPostId(), "Love the video!", user6);


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