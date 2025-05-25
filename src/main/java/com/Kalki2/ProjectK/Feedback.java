package com.Kalki2.ProjectK;

import jakarta.persistence.*;
import java.time.LocalDateTime; // For timestamp

@Entity
@Table(name = "feedback") // Name your table "feedback"
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store the user's email for identification and display
    @Column(nullable = false)
    private String userEmail;

    // Store the user's name (optional, but good for display)
    private String userName;

    @Column(nullable = false)
    private Integer rating; // e.g., 1 to 5 stars

    @Column(nullable = false, length = 1000) // Max 1000 characters for feedback message
    private String feedbackContent;

    @Column(nullable = false)
    private LocalDateTime timestamp; // When the feedback was submitted

    // Constructors
    public Feedback() {
        // Default constructor
    }

    public Feedback(String userEmail, String userName, Integer rating, String feedbackContent, LocalDateTime timestamp) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.rating = rating;
        this.feedbackContent = feedbackContent;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedbackContent() {
        return feedbackContent;
    }

    public void setFeedbackContent(String feedbackContent) {
        this.feedbackContent = feedbackContent;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Feedback{" +
                "id=" + id +
                ", userEmail='" + userEmail + '\'' +
                ", userName='" + userName + '\'' +
                ", rating=" + rating +
                ", feedbackContent='" + feedbackContent + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}