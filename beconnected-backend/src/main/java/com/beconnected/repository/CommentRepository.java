package com.beconnected.repository;

import com.beconnected.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostPostId(Long postId);

    List<Comment> findByUserUserId(Long userId);
}
