package com.Kalki2.ProjectK; // Make sure this package matches your project's package

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Recommended for clarity

@Repository // Optional, but good practice to mark it as a Spring repository component
public interface CharacterDetailRepository extends JpaRepository<CharacterDetail, Long> {

    // Custom method to find a CharacterDetail by its name
    // Spring Data JPA will automatically implement this method for you
    CharacterDetail findByName(String name);

    // You could add other methods here if needed, e.g.,
    // List<CharacterDetail> findByRole(String role);
}