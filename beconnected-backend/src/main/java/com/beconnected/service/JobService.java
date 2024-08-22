package com.beconnected.service;

import com.beconnected.dto.JobDTO;
import com.beconnected.model.Job;
import com.beconnected.model.User;
import com.beconnected.repository.JobRepository;
import com.beconnected.utilities.JobScorePair;
import com.beconnected.utilities.MatrixFactorization;
import lombok.AllArgsConstructor;
import org.apache.commons.text.similarity.CosineSimilarity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class JobService {

    private final JobRepository jobRepository;

    private final MatrixFactorization matrixFactorization;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long jobId) {
        return jobRepository.findById(jobId);
    }

    public List<JobDTO> getJobsByUser(String username) {
        List<Job> jobs = jobRepository.findByUserMadeByUsername(username);
        return jobs.stream()
                .map(job -> new JobDTO(job.getTitle(), job.getDescription()))
                .collect(Collectors.toList());
    }

    public Job createJob(String title, String description, User userMadeBy) {
        Job job = new Job(title, description, userMadeBy, LocalDateTime.now(), true);
        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }

    public void addApplicant(Long jobId, User applicant) {
        Optional<Job> jobOptional = jobRepository.findById(jobId);
        if (jobOptional.isPresent()) {
            Job job = jobOptional.get();
            job.addApplicant(applicant);
            jobRepository.save(job);
        }
    }

    public void removeApplicant(Long jobId, User applicant) {
        Optional<Job> jobOptional = jobRepository.findById(jobId);
        if (jobOptional.isPresent()) {
            Job job = jobOptional.get();
            job.removeApplicant(applicant);
            jobRepository.save(job);
        }
    }

    private double calculateScore(User user, Job job) {
        CosineSimilarity cosineSimilarity = new CosineSimilarity();

        String userSkillsStr = String.join(" ", user.getSkills()).toLowerCase();
        String userBio = user.getBio() != null ? user.getBio().toLowerCase() : "";

        String jobTitle = job.getTitle() != null ? job.getTitle().toLowerCase() : "";
        String jobDescription = job.getDescription() != null ? job.getDescription().toLowerCase() : "";

        String[] userProfile = (userSkillsStr + " " + userBio).split("\\W+");
        String[] jobProfile = (jobTitle + " " + jobDescription).split("\\W+");

        Map<CharSequence, Integer> userProfileMap = Arrays.stream(userProfile)
                .collect(Collectors.toMap(word -> (CharSequence) word, word -> 1, Integer::sum));
        Map<CharSequence, Integer> jobProfileMap = Arrays.stream(jobProfile)
                .collect(Collectors.toMap(word -> (CharSequence) word, word -> 1, Integer::sum));

        return cosineSimilarity.cosineSimilarity(userProfileMap, jobProfileMap);
    }

    public double[][] generateScoreMatrix(List<User> users, List<Job> jobs) {
        int numUsers = users.size();
        int numJobs = jobs.size();
        double[][] scoreMatrix = new double[numUsers][numJobs];

        for (int i = 0; i < numUsers; i++) {
            User user = users.get(i);
            for (int j = 0; j < numJobs; j++) {
                Job job = jobs.get(j);
                scoreMatrix[i][j] = calculateScore(user, job);
            }
        }

        return scoreMatrix;
    }


    public List<Job> recommendJobsForUser(User user) {
        List<Job> jobs = getAllJobs();
        double[][] scoreMatrix = generateScoreMatrix(List.of(user), jobs);

        double[][] predictedMatrix = matrixFactorization.factorization(scoreMatrix, 500);

        int userIndex = 0;
        List<JobScorePair> jobScorePairs = new ArrayList<>();

        for (int j = 0; j < jobs.size(); j++) {
            jobScorePairs.add(new JobScorePair(jobs.get(j), predictedMatrix[userIndex][j]));
        }

        jobScorePairs.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        return jobScorePairs.stream()
                .map(JobScorePair::getJob)
                .collect(Collectors.toList());
    }
}
