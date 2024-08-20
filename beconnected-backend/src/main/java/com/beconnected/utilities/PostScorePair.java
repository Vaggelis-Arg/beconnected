package com.beconnected.utilities;

import com.beconnected.model.Post;

public class PostScorePair {
    private final Post post;
    private final double score;

    public PostScorePair(Post post, double score) {
        this.post = post;
        this.score = score;
    }

    public Post getPost() {
        return post;
    }

    public double getScore() {
        return score;
    }
}
