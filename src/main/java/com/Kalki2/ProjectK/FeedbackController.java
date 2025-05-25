package com.Kalki2.ProjectK;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/user") // Specific path for user-related actions
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository; // To fetch user name if not directly in token

    @PostMapping("/feedback") // Specific endpoint for user feedback submission
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> feedbackRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }

        String userEmail = authentication.getName(); // Get email from authenticated principal

        // Fetch AppUser to get the name, as name isn't necessarily in the JWT claims
        AppUser appUser = userRepository.findByEmail(userEmail);
        String userName = (appUser != null) ? appUser.getName() : userEmail; // Use name if available, else email

        Integer rating = (Integer) feedbackRequest.get("rating");
        String feedbackContent = (String) feedbackRequest.get("feedback");

        if (rating == null || feedbackContent == null || feedbackContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Rating and feedback content are required.");
        }

        if (rating < 1 || rating > 5) { // Basic validation for rating
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5.");
        }

        Feedback feedback = new Feedback();
        feedback.setUserEmail(userEmail);
        feedback.setUserName(userName);
        feedback.setRating(rating);
        feedback.setFeedbackContent(feedbackContent.trim());
        feedback.setTimestamp(LocalDateTime.now()); // Set current timestamp

        feedbackRepository.save(feedback);

        return ResponseEntity.status(HttpStatus.CREATED).body("Feedback submitted successfully!");
    }
}