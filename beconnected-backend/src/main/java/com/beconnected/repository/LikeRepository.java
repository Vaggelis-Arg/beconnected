package com.beconnected.repository;

import com.beconnected.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    List<Like> findByPostPostId(Long postId);

    List<Like> findByUserUserId(Long userId);

    Optional<Like> findByPostPostIdAndUserUserId(Long postId, Long userId);
}
