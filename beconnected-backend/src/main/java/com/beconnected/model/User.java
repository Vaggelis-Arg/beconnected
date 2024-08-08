package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
@Data
@Table(name = "user")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(unique = true)
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private LocalDate memberSince;

    @Enumerated(value = EnumType.STRING)
    private UserRole userRole;

    private Boolean locked;
    private Boolean enabled;

    @OneToMany(mappedBy = "following")
    private Set<Connection> following = new HashSet<>();

    @OneToMany(mappedBy = "followed")
    private Set<Connection> followers = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_picture_id", referencedColumnName = "picture_id", unique = true)
    private Picture profilePicture;

    // New fields for Bio, Experience, Education, and Skills
    @Column(length = 1000)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "user_experience", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "experience")
    private Set<String> experience = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_education", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "education")
    private Set<String> education = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    public User(String username, String firstName, String lastName, String email, String phone, String password,
                LocalDate memberSince, UserRole userRole, Boolean locked, Boolean enabled, Picture profilePicture,
                String bio, Set<String> experience, Set<String> education, Set<String> skills) {
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
        this.profilePicture = profilePicture;
        this.bio = bio;
        this.experience = experience;
        this.education = education;
        this.skills = skills;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userRole.name()));
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
