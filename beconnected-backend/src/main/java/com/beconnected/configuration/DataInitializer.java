package com.beconnected.configuration;

import com.beconnected.model.*;
import com.beconnected.repository.*;
import com.beconnected.service.AuthenticationService;
import com.beconnected.service.ConnectionService;
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
    private final ConnectionService connectionService;

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
                    LocalDate.now(), UserRole.USER, false, true, pic7, "Experienced Software Engineer with 12 years in leading companies, specializing in designing, developing, and optimizing software solutions.",
                    Set.of("Java Developer", "Python developer", "Cyber Security"), Set.of("MIT"), Set.of("Java", "Spring Boot", "C++"));

            User user2 = new User("jane.james", "Jane", "James", "jane@mail.com", "0987654321", passwordEncoder.encode("password2"),
                    LocalDate.now(), UserRole.USER, false, true, pic1, "Student at Harvard Business School. I have already worked as a Product Manager at Google and I am looking for a job at high finance.",
                    Set.of("Product Manager"), Set.of("Harvard"), Set.of("Management", "Leadership"));

            User user3 = new User("nikos87", "Nikos", "Papadopoulos", "nikos.papa@mail.com", "1112223333", passwordEncoder.encode("password3"),
                    LocalDate.now(), UserRole.USER, false, true, pic8, "Experienced IT Consultant specializing in Cloud Solutions and Data Security.",
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

            connectionService.requestConnection(user1, user4);
            connectionService.requestConnection(user3, user7);
            connectionService.requestConnection(user6, user10);
            connectionService.requestConnection(user10, user14);
            connectionService.requestConnection(user14, user15);
            connectionService.requestConnection(user4, user9);
            connectionService.requestConnection(user1, user9);
            connectionService.requestConnection(user1, user8);
            Connection conn1 = new Connection(null, user1, user2, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn2 = new Connection(null, user1, user3, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn3 = new Connection(null, user2, user5, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn4 = new Connection(null, user3, user6, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn5 = new Connection(null, user4, user8, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn6 = new Connection(null, user5, user9, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn7 = new Connection(null, user7, user11, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn8 = new Connection(null, user2, user10, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn9 = new Connection(null, user8, user12, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn10 = new Connection(null, user9, user13, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn11 = new Connection(null, user11, user15, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn12 = new Connection(null, user12, user1, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn13 = new Connection(null, user13, user14, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn14 = new Connection(null, user13, user15, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn15 = new Connection(null, user1, user5, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn16 = new Connection(null, user2, user6, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn17 = new Connection(null, user3, user8, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn18 = new Connection(null, user5, user10, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn19 = new Connection(null, user6, user11, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn20 = new Connection(null, user7, user12, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn21 = new Connection(null, user8, user13, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn22 = new Connection(null, user9, user14, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn23 = new Connection(null, user10, user15, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn24 = new Connection(null, user11, user1, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn25 = new Connection(null, user12, user2, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn26 = new Connection(null, user1, user7, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn27 = new Connection(null, user7, user6, ConnectionStatus.ACCEPTED, LocalDate.now());
            Connection conn28 = new Connection(null, user4, user10, ConnectionStatus.ACCEPTED, LocalDate.now());

            connectionRepository.saveAll(Set.of(
                    conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8, conn9, conn10,
                    conn11, conn12, conn13, conn14, conn15, conn16, conn17, conn18, conn19, conn20,
                    conn21, conn22, conn23, conn24, conn25, conn26, conn27, conn28
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
            Message message3 = new Message(user3, user4, "Hi Elektra, long time no see!");
            Message message4 = new Message(user4, user3, "Hi Nikos, glad to hear from you!");
            Message message5 = new Message(user5, user6, "Hi Maria, can you help with a marketing campaign?");
            Message message6 = new Message(user6, user5, "Sure, Jason. What do you need?");
            Message message7 = new Message(user7, user8, "Hi Elena, I heard you're looking for a mobile developer.");
            Message message8 = new Message(user8, user7, "Yes, John. Are you interested?");
            Message message9 = new Message(user9, user10, "Hello Anna, great to connect with you!");
            Message message10 = new Message(user10, user9, "Hi Dimitrios, likewise!");
            Message message11 = new Message(user11, user12, "Hi Sofia, I loved your UX designs!");
            Message message12 = new Message(user12, user11, "Thank you, Oliver!");
            Message message13 = new Message(user13, user14, "Hey Jack, I'm interested in your project management techniques.");
            Message message14 = new Message(user14, user13, "Happy to share them with you, Youssef!");
            Message message15 = new Message(user15, user1, "Hello Mike, I noticed you work with renewable energy solutions.");
            Message message16 = new Message(user1, user15, "Yes, Kostas. How can I assist?");
            Message message17 = new Message(user2, user3, "Hey Nikos, how's the consulting business?");
            Message message18 = new Message(user3, user2, "It's going great, Jane. Thanks for asking!");
            Message message19 = new Message(user4, user5, "Jason, are you available for a collaboration?");
            Message message20 = new Message(user5, user4, "Absolutely, Elektra!");
            Message message21 = new Message(user6, user7, "John, can you give me some tips on mobile app development?");
            Message message22 = new Message(user7, user6, "Of course, Maria!");
            Message message23 = new Message(user8, user9, "Dimitrios, are you still working on infrastructure projects?");
            Message message24 = new Message(user9, user8, "Yes, Elena. It's keeping me busy!");
            Message message25 = new Message(user10, user11, "Oliver, I'm interested in data-driven decision making.");
            Message message26 = new Message(user11, user10, "I can definitely help, Anna.");
            Message message27 = new Message(user12, user13, "Youssef, do you need help with network design?");
            Message message28 = new Message(user13, user12, "That would be great, Sofia!");
            Message message29 = new Message(user14, user15, "Kostas, how are you finding the renewable energy field?");
            Message message30 = new Message(user15, user14, "It's challenging but rewarding, Jack.");
            Message message31 = new Message(user1, user2, "Jane, any tips for entering product management?");
            Message message32 = new Message(user2, user1, "Sure, Mike. Let's set up a time to talk.");
            Message message33 = new Message(user3, user4, "Elektra, how's the design industry treating you?");
            Message message34 = new Message(user4, user3, "It's going well, Nikos!");
            Message message35 = new Message(user5, user6, "Maria, what's your take on AI in marketing?");
            Message message36 = new Message(user6, user5, "I think it's the future, Jason!");
            Message message37 = new Message(user7, user8, "Elena, can we discuss HR strategies?");
            Message message38 = new Message(user8, user7, "I'd love to, John.");
            Message message39 = new Message(user9, user10, "Anna, are you still writing?");
            Message message40 = new Message(user10, user9, "Always, Dimitrios.");
            Message message41 = new Message(user11, user12, "Sofia, let's collaborate on a UX project.");
            Message message42 = new Message(user12, user11, "Sounds good, Oliver.");
            Message message43 = new Message(user13, user14, "Jack, any new Agile projects?");
            Message message44 = new Message(user14, user13, "Plenty, Youssef.");
            Message message45 = new Message(user15, user1, "Mike, any advice for an electrical engineer?");
            Message message46 = new Message(user1, user15, "Happy to help, Kostas.");
            Message message47 = new Message(user2, user3, "Nikos, what's new in cloud computing?");
            Message message48 = new Message(user3, user2, "A lot, Jane. We should catch up.");
            Message message49 = new Message(user4, user5, "Jason, need help with a graphic design project?");
            Message message50 = new Message(user5, user4, "That would be great, Elektra.");
            Message message51 = new Message(user6, user7, "John, can you recommend a good coding framework?");
            Message message52 = new Message(user7, user6, "Sure, Maria. Let's talk.");
            Message message53 = new Message(user8, user9, "Dimitrios, how's your latest project going?");
            Message message54 = new Message(user9, user8, "It's progressing well, Elena.");
            Message message55 = new Message(user10, user11, "Oliver, let's discuss business analytics.");
            Message message56 = new Message(user11, user10, "I'm in, Anna.");
            Message message57 = new Message(user12, user13, "Youssef, any interesting networking challenges?");
            Message message58 = new Message(user13, user12, "A few, Sofia.");
            Message message59 = new Message(user14, user15, "Kostas, do you work with Agile?");
            Message message60 = new Message(user15, user14, "Yes, Jack. It's essential in my field.");
            Message message61 = new Message(user1, user2, "Jane, thanks for the product management tips!");
            Message message62 = new Message(user2, user1, "You're welcome, Mike.");
            Message message63 = new Message(user3, user4, "Elektra, how's the new project?");
            Message message64 = new Message(user4, user3, "It's exciting, Nikos.");
            Message message65 = new Message(user5, user6, "Maria, can we meet to discuss AI?");
            Message message66 = new Message(user6, user5, "Let's do it, Jason.");
            Message message67 = new Message(user7, user8, "Elena, any HR insights?");
            Message message68 = new Message(user8, user7, "Plenty, John.");
            Message message69 = new Message(user9, user10, "Anna, any new writing projects?");
            Message message70 = new Message(user10, user9, "Yes, Dimitrios. I'm working on a novel.");

            messageRepository.saveAll(Set.of(
                    message1, message2, message3, message4, message5, message6, message7, message8, message9, message10,
                    message11, message12, message13, message14, message15, message16, message17, message18, message19, message20,
                    message21, message22, message23, message24, message25, message26, message27, message28, message29, message30,
                    message31, message32, message33, message34, message35, message36, message37, message38, message39, message40,
                    message41, message42, message43, message44, message45, message46, message47, message48, message49, message50,
                    message51, message52, message53, message54, message55, message56, message57, message58, message59, message60,
                    message61, message62, message63, message64, message65, message66, message67, message68, message69, message70
            ));

            Job job1 = new Job("Java Developer", "Looking for a Java developer", user1, LocalDateTime.now(), true);
            Job job2 = new Job("Product Manager", "Looking for a Product Manager", user2, LocalDateTime.now(), true);
            Job job3 = new Job("IT Consultant", "Seeking an IT Consultant for a short-term project", user3, LocalDateTime.now(), true);
            Job job4 = new Job("Graphic Designer", "Hiring a Graphic Designer for a new campaign", user4, LocalDateTime.now(), true);
            Job job5 = new Job("Marketing Specialist", "Looking for a marketing specialist with digital skills", user5, LocalDateTime.now(), true);
            Job job6 = new Job("Data Scientist", "Need a Data Scientist with AI expertise", user6, LocalDateTime.now(), true);
            Job job7 = new Job("Mobile Developer", "Hiring a mobile developer for a startup", user7, LocalDateTime.now(), true);
            Job job8 = new Job("HR Manager", "Seeking an HR Manager with experience in talent acquisition", user8, LocalDateTime.now(), true);
            Job job9 = new Job("Civil Engineer", "Hiring a Civil Engineer for infrastructure projects", user9, LocalDateTime.now(), true);
            Job job10 = new Job("Content Writer", "Looking for a content writer for blogs and articles", user10, LocalDateTime.now(), true);
            Job job11 = new Job("UX Designer", "Need a UX Designer for a new web application", user11, LocalDateTime.now(), true);
            Job job12 = new Job("Project Manager", "Seeking an experienced Project Manager", user12, LocalDateTime.now(), true);
            Job job13 = new Job("Network Engineer", "Looking for a Network Engineer with security expertise", user13, LocalDateTime.now(), true);
            Job job14 = new Job("Electrical Engineer", "Hiring an Electrical Engineer for a new project", user14, LocalDateTime.now(), true);
            Job job15 = new Job("Renewable Energy Consultant", "Need a consultant for renewable energy solutions", user15, LocalDateTime.now(), true);
            Job job16 = new Job("Software Engineer", "Looking for a Software Engineer with Python skills", user1, LocalDateTime.now(), true);
            Job job17 = new Job("Digital Marketer", "Hiring a Digital Marketer for a social media campaign", user2, LocalDateTime.now(), true);
            Job job18 = new Job("Database Administrator", "Need a Database Administrator for optimization", user3, LocalDateTime.now(), true);
            Job job19 = new Job("Web Developer", "Looking for a Web Developer with frontend skills", user4, LocalDateTime.now(), true);
            Job job20 = new Job("SEO Specialist", "Seeking an SEO Specialist for a website project", user5, LocalDateTime.now(), true);
            Job job21 = new Job("AI Engineer", "Hiring an AI Engineer for machine learning projects", user6, LocalDateTime.now(), true);
            Job job22 = new Job("Full Stack Developer", "Need a Full Stack Developer for a startup", user7, LocalDateTime.now(), true);
            Job job23 = new Job("Talent Acquisition Specialist", "Looking for a Talent Acquisition Specialist", user8, LocalDateTime.now(), true);
            Job job24 = new Job("Architect", "Hiring an Architect for building design", user9, LocalDateTime.now(), true);
            Job job25 = new Job("Technical Writer", "Seeking a Technical Writer for documentation", user10, LocalDateTime.now(), true);
            Job job26 = new Job("UI Designer", "Need a UI Designer for a mobile app", user11, LocalDateTime.now(), true);
            Job job27 = new Job("Operations Manager", "Looking for an Operations Manager for logistics", user12, LocalDateTime.now(), true);
            Job job28 = new Job("System Administrator", "Hiring a System Administrator for network management", user13, LocalDateTime.now(), true);
            Job job29 = new Job("Instrumentation Engineer", "Need an Instrumentation Engineer for monitoring systems", user14, LocalDateTime.now(), true);
            Job job30 = new Job("Sustainability Consultant", "Looking for a Sustainability Consultant for eco-friendly solutions", user15, LocalDateTime.now(), true);
            Job job31 = new Job("DevOps Engineer", "Hiring a DevOps Engineer for cloud infrastructure", user1, LocalDateTime.now(), true);
            Job job32 = new Job("Brand Manager", "Need a Brand Manager for a new product launch", user2, LocalDateTime.now(), true);
            Job job33 = new Job("Scrum Master", "Looking for a Scrum Master for Agile teams", user3, LocalDateTime.now(), true);
            Job job34 = new Job("Frontend Developer", "Hiring a Frontend Developer with React experience", user4, LocalDateTime.now(), true);
            Job job35 = new Job("Market Analyst", "Seeking a Market Analyst for research projects", user5, LocalDateTime.now(), true);
            Job job36 = new Job("Cloud Engineer", "Need a Cloud Engineer for deployment and management", user6, LocalDateTime.now(), true);
            Job job37 = new Job("Backend Developer", "Looking for a Backend Developer with Java expertise", user7, LocalDateTime.now(), true);
            Job job38 = new Job("Compensation Specialist", "Hiring a Compensation Specialist for salary planning", user8, LocalDateTime.now(), true);
            Job job39 = new Job("Structural Engineer", "Need a Structural Engineer for building projects", user9, LocalDateTime.now(), true);
            Job job40 = new Job("Public Relations Specialist", "Seeking a Public Relations Specialist for media outreach", user10, LocalDateTime.now(), true);
            Job job41 = new Job("Interaction Designer", "Looking for an Interaction Designer for user engagement", user11, LocalDateTime.now(), true);
            Job job42 = new Job("Financial Analyst", "Hiring a Financial Analyst for budgeting", user12, LocalDateTime.now(), true);
            Job job43 = new Job("IT Support Specialist", "Need an IT Support Specialist for technical assistance", user13, LocalDateTime.now(), true);
            Job job44 = new Job("Project Engineer", "Looking for a Project Engineer for construction projects", user14, LocalDateTime.now(), true);
            Job job45 = new Job("Energy Efficiency Expert", "Hiring an Energy Efficiency Expert for audits", user15, LocalDateTime.now(), true);
            Job job46 = new Job("Database Engineer", "Need a Database Engineer for backend development", user1, LocalDateTime.now(), true);
            Job job47 = new Job("Social Media Manager", "Looking for a Social Media Manager for strategy", user2, LocalDateTime.now(), true);
            Job job48 = new Job("Business Analyst", "Hiring a Business Analyst for project insights", user3, LocalDateTime.now(), true);
            Job job49 = new Job("Game Developer", "Need a Game Developer for interactive applications", user4, LocalDateTime.now(), true);
            Job job50 = new Job("Cybersecurity Analyst", "Looking for a Cybersecurity Analyst for threat management", user6, LocalDateTime.now(), true);


            jobRepository.saveAll(Set.of(
                    job1, job2, job3, job4, job5, job6, job7, job8, job9, job10,
                    job11, job12, job13, job14, job15, job16, job17, job18, job19, job20,
                    job21, job22, job23, job24, job25, job26, job27, job28, job29, job30,
                    job31, job32, job33, job34, job35, job36, job37, job38, job39, job40,
                    job41, job42, job43, job44, job45, job46, job47, job48, job49, job50
            ));
        }
    }

    private byte[] loadMediaFromFile(String path) throws IOException {
        File file = new File(path);
        return Files.readAllBytes(file.toPath());
    }
}