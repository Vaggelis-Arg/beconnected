package com.beconnected.repository;

import com.beconnected.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthorUserIdOrderByCreatedAtDesc(Long authorId);

    List<Post> findByLikedByUsersUserIdOrderByCreatedAtDesc(Long userId);

    List<Post> findByAuthorInOrderByCreatedAtDesc(List<Long> authorIds);
}
