package com.beconnected.repository;

import com.beconnected.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthorUserIdOrderByCreatedAtDesc(Long authorId);

    Optional<Post> findById(Long postId);

    @Query("SELECT p FROM Post p WHERE p.author.userId IN :authorIds ORDER BY p.createdAt DESC")
    List<Post> findByAuthorInOrderByCreatedAtDesc(@Param("authorIds") List<Long> authorIds);

}
