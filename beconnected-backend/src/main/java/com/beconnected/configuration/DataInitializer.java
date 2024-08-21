package com.beconnected.configuration;

import ch.qos.logback.classic.encoder.JsonEncoder;
import com.beconnected.model.User;
import com.beconnected.model.UserRole;
import com.beconnected.service.AuthenticationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AuthenticationService authenticationService;

    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AuthenticationService authenticationService, PasswordEncoder passwordEncoder) {
        this.authenticationService = authenticationService;
        this.passwordEncoder = passwordEncoder;
    }

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
    }
}
