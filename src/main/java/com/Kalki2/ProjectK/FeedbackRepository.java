package com.Kalki2.ProjectK;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // JpaRepository provides methods like save, findAll, findById, deleteById
}