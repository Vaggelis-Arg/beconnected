package com.beconnected.service;

import com.beconnected.configuration.CustomLogoutHandler;
import com.beconnected.dto.LoginRequestDTO;
import com.beconnected.model.*;
import com.beconnected.repository.TokenRepository;
import com.beconnected.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final CustomLogoutHandler customLogoutHandler;

    public AuthenticationResponse register(User request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent() || userRepository.findByUsername(request.getUsername()).isPresent()) {
            return new AuthenticationResponse(request.getUserId(), null, null, "Username or Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUserRole(UserRole.USER);
        user.setMemberSince(LocalDate.now());
        user.setEnabled(true);
        user.setLocked(false);

        user = userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserTokens(accessToken, refreshToken, user);

        return new AuthenticationResponse(user.getUserId(), accessToken, refreshToken, "User registration was successful");
    }


    public AuthenticationResponse authenticate(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.usernameOrEmail(), request.password())
        );

        User user = userRepository.findByUsername(request.usernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.usernameOrEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found")));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        revokeAllTokensByUser(user);
        saveUserTokens(accessToken, refreshToken, user);

        return new AuthenticationResponse(user.getUserId(), accessToken, refreshToken, "User login was successful");
    }

    public void logout(HttpServletRequest request, HttpServletResponse response, String authHeader) {
        customLogoutHandler.logout(request, response, null);
    }

    public User getAdmin() {
        return (User) userRepository.findByUserRole(UserRole.ADMIN).orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }


    private void revokeAllTokensByUser(User user) {
        List<Token> validTokens = tokenRepository.findAllAccessTokensByUser(user.getUserId());

        if (validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t -> {
            t.setLoggedOut(true);
        });

        tokenRepository.saveAll(validTokens);
    }

    private void saveUserTokens(String accessToken, String refreshToken, User user) {
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setUser(user);
        token.setLoggedOut(false);
        tokenRepository.save(token);
    }

    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String refreshToken = authHeader.substring(7);

        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (jwtService.isValidRefreshToken(refreshToken, user)) {
            String newAccessToken = jwtService.generateAccessToken(user);

            Token token = tokenRepository.findByRefreshToken(refreshToken).orElseThrow(() -> new RuntimeException("Token not found"));

            token.setAccessToken(newAccessToken);
            tokenRepository.save(token);

            return new ResponseEntity<>(new AuthenticationResponse(user.getUserId(), newAccessToken, refreshToken, "New access token was successfully generated"), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
