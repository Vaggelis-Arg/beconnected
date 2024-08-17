package com.beconnected.controller;

import com.beconnected.model.Job;
import com.beconnected.model.User;
import com.beconnected.service.JobService;
import com.beconnected.service.JwtService;
import com.beconnected.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestParam String title,
                                         @RequestParam String description,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User userMadeBy = userService.findById(userId);

        Job job = jobService.createJob(title, description, userMadeBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(job);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<Job> getJobById(@PathVariable Long jobId) {
        Optional<Job> job = jobService.getJobById(jobId);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Job>> getActiveJobs() {
        List<Job> jobs = jobService.getActiveJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getJobsByUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User userMadeBy = userService.findById(userId);

        List<Job> jobs = jobService.getJobsByUser(userMadeBy.getUsername());
        return ResponseEntity.ok(jobs);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId,
                                          @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User userMadeBy = userService.findById(userId);

        Optional<Job> job = jobService.getJobById(jobId);
        if (job.isPresent() && job.get().getUserMadeBy().equals(userMadeBy)) {
            jobService.deleteJob(jobId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<Void> applyForJob(@PathVariable Long jobId,
                                            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User applicant = userService.findById(userId);

        jobService.addApplicant(jobId, applicant);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{jobId}/remove-application")
    public ResponseEntity<Void> removeApplication(@PathVariable Long jobId,
                                                  @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        User applicant = userService.findById(userId);

        jobService.removeApplicant(jobId, applicant);
        return ResponseEntity.ok().build();
    }
}
