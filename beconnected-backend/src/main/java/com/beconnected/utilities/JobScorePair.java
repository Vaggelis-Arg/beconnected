package com.beconnected.utilities;

import com.beconnected.model.Job;
import lombok.Getter;

@Getter
public class JobScorePair {
    private final Job job;
    private final double score;

    public JobScorePair(Job job, double score) {
        this.job = job;
        this.score = score;
    }
}