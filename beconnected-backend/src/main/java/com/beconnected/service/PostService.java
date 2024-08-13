package com.beconnected.service;

import com.beconnected.model.Post;
import com.beconnected.model.User;
import com.beconnected.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;


    public Post createPost(String textContent, byte[] mediaContent, String mediaType, User author) {
        Post post = new Post(textContent, mediaContent, mediaType, author);
        return postRepository.save(post);
    }


    public List<Post> getPostsByAuthor(Long authorId) {
        return postRepository.findByAuthorUserIdOrderByCreatedAtDesc(authorId);
    }


    public List<Post> getPostsLikedByUser(Long userId) {
        return postRepository.findByLikedByUsersUserIdOrderByCreatedAtDesc(userId);
    }


    public List<Post> getFeedForUser(List<Long> authorIds) {
        return postRepository.findByAuthorInOrderByCreatedAtDesc(authorIds);
    }


    public void addComment(Long postId, String comment) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            Set<String> comments = post.getComments();
            if (comments == null) {
                comments = new HashSet<>();
            }
            comments.add(comment);
            post.setComments(comments);
            postRepository.save(post);
        } else {
            throw new RuntimeException("Post not found with id: " + postId);
        }
    }


    public void likePost(Long postId, User user) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            Set<User> likedByUsers = post.getLikedByUsers();
            if (likedByUsers == null) {
                likedByUsers = new HashSet<>();
            }
            likedByUsers.add(user);
            post.setLikedByUsers(likedByUsers);
            postRepository.save(post);
        } else {
            throw new RuntimeException("Post not found with id: " + postId);
        }
    }
}
