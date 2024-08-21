package com.beconnected.configuration;

import com.beconnected.model.User;
import com.beconnected.model.UserRole;
import com.beconnected.service.AuthenticationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AuthenticationService authenticationService;

    public DataInitializer(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public void run(String... args) throws Exception {
        User admin = new User();
        admin.setUsername("admin");
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@example.com");
        admin.setPhone("1234567890");
        admin.setPassword("password");
        admin.setMemberSince(LocalDate.now());
        admin.setUserRole(UserRole.ADMIN);
        admin.setEnabled(true);
        admin.setLocked(false);
        admin.setBio("Admin bio");
        admin.setExperience(Set.of("Admin Experience"));
        admin.setEducation(Set.of("Admin Education"));
        admin.setSkills(Set.of("Admin Skills"));

        authenticationService.registerAdmin(admin);
    }
}
