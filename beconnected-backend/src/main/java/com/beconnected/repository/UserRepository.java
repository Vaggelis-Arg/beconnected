package com.beconnected.repository;

import com.beconnected.model.User;
import com.beconnected.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long userId);

    @Query("SELECT u FROM User u WHERE " +
            "(LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "u.userId <> :currentUserId AND u.userRole <> 'ADMIN'")
    List<User> searchUsers(@Param("query") String query, @Param("currentUserId") Long currentUserId);

    Optional<Object> findByUserRole(UserRole userRole);

    @Query("SELECT u FROM User u WHERE u.userRole <> 'ADMIN'")
    List<User> findAllExcludingAdmin();

}
