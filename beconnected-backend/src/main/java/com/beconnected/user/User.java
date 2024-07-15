package com.beconnected.user;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.List;


@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long userID;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    private String password;

    private LocalDate memberSince;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    private Boolean locked;
    private Boolean enabled;

    public User(String username, String firstName, String lastName, String email, String phone, String password, LocalDate memberSince, UserRole userRole, Boolean locked, Boolean enabled) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.memberSince = memberSince;
        this.userRole = userRole;
        this.locked = locked;
        this.enabled = enabled;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userRole.name());
        return Collections.singleton(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !locked;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
