package com.beconnected.utilities;

import com.beconnected.model.Job;

public class JobScorePair {
    private final Job job;
    private final double score;

    public JobScorePair(Job job, double score) {
        this.job = job;
        this.score = score;
    }

    public Job getJob() {
        return job;
    }

    public double getScore() {
        return score;
    }
}