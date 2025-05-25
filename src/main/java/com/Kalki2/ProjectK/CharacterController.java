package com.Kalki2.ProjectK; // Make sure this package matches your project's package

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional; // Used for handling cases where a character might not be found

@RestController
@RequestMapping("/api/characters") // Base URL for character-related endpoints
@CrossOrigin(origins = "http://localhost:3000") // Allow your React frontend
public class CharacterController {

    @Autowired
    private CharacterDetailRepository characterDetailRepository; // Inject the repository

    /**
     * Endpoint to get details of a specific character by their name.
     * Accessible at /api/characters/{characterName}
     * Example: GET /api/characters/Kalki
     */
    @GetMapping("/{characterName}")
    public ResponseEntity<?> getCharacterDetailsByName(@PathVariable String characterName) {
        // Use the custom findByName method from your repository
        CharacterDetail characterDetail = characterDetailRepository.findByName(characterName);

        if (characterDetail != null) {
            // If character found, return its details
            return ResponseEntity.ok(characterDetail);
        } else {
            // If character not found, return a 404 Not Found response
            return ResponseEntity.status(404).body("Character details not found for: " + characterName);
        }
    }

    // You could add other endpoints here later, e.g., to get all characters,
    // or to add/update characters (for an admin interface).
}