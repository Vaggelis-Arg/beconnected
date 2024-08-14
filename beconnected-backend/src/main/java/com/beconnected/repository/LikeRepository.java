package com.beconnected.repository;

import com.beconnected.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    List<Like> findByPostPostId(Long postId);

    List<Like> findByUserUserId(Long userId);
}
