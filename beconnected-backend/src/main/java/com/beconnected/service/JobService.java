package com.beconnected.service;

import com.beconnected.model.Job;
import com.beconnected.model.User;
import com.beconnected.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long jobId) {
        return jobRepository.findById(jobId);
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findByIsActiveTrue();
    }

    public List<Job> getJobsByUser(String username) {
        return jobRepository.findByUserMadeByUsername(username);
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
}
