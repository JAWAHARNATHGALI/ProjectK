// src/main/java/com/Kalki2/ProjectK/AdminController.java (FULL CODE - FIX for getFavoriteCharacterAnalytics)
package com.Kalki2.ProjectK;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;

import com.Kalki2.ProjectK.Feedback;
import com.Kalki2.ProjectK.FeedbackRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private final String ADMIN_USERNAME_EMAIL = "admin@gmail.com";
    private final String ADMIN_RAW_PASSWORD = "admin";
    private String ADMIN_ENCODED_PASSWORD;

    @PostConstruct
    public void init() {
        this.ADMIN_ENCODED_PASSWORD = passwordEncoder.encode(ADMIN_RAW_PASSWORD);
        System.out.println("AdminController: Hardcoded admin password has been encoded at startup.");

        // Create the admin user if they don't exist by email
        AppUser existingAdmin = userRepository.findByEmail(ADMIN_USERNAME_EMAIL);
        if (existingAdmin == null) {
            AppUser adminUser = new AppUser();
            adminUser.setEmail(ADMIN_USERNAME_EMAIL);
            adminUser.setPassword(ADMIN_ENCODED_PASSWORD);
            adminUser.setName("Admin User"); // Give a default name for display
            userRepository.save(adminUser);
            System.out.println("Admin user 'admin@gmail.com' created.");
        } else if (!passwordEncoder.matches(ADMIN_RAW_PASSWORD, existingAdmin.getPassword())) {
            // Optional: Update password if raw password changed (for development convenience)
            existingAdmin.setPassword(ADMIN_ENCODED_PASSWORD);
            userRepository.save(existingAdmin);
            System.out.println("Admin user 'admin@gmail.com' password updated.");
        }
    }

    @PostMapping("/adminLogin")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        // Authenticate against the hardcoded admin credentials
        if (ADMIN_USERNAME_EMAIL.equals(email) && passwordEncoder.matches(password, ADMIN_ENCODED_PASSWORD)) {
            String token = jwtUtil.generateToken(email, "ADMIN"); // Use email as subject

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Admin login successful!");
            response.put("isAdmin", true);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials.");
        }
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppUser>> getAllUsers() {
        List<AppUser> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<AppUser> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            AppUser userToDelete = userOptional.get();
            // Prevent deleting the hardcoded admin user by email
            if (ADMIN_USERNAME_EMAIL.equals(userToDelete.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot delete the primary admin user account.");
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @GetMapping("/adminUsers") // This was a placeholder, can remain or be removed later
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAdminUsersPlaceholder() {
        return ResponseEntity.ok("Welcome, Admin! This is a placeholder for admin functions. Use /api/admin/users for user management.");
    }

    @GetMapping("/admin/feedback")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackRepository.findAll();
        return ResponseEntity.ok(feedbackList);
    }

    // NEW METHOD: Endpoint for Admin to get favorite character analytics
    @GetMapping("/admin/analytics/favorite-characters")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getFavoriteCharacterAnalytics() {
        List<AppUser> users = userRepository.findAll();

        Map<String, Long> characterCounts = users.stream()
                .filter(user -> user.getFavoriteCharacter() != null && !user.getFavoriteCharacter().isEmpty()) // Filter out null/empty characters
                .collect(Collectors.groupingBy(AppUser::getFavoriteCharacter, Collectors.counting()));

        // Convert map to a list of maps for easier JSON serialization and sorting
        List<Map<String, Object>> result = characterCounts.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("characterName", entry.getKey());
                    item.put("count", entry.getValue());
                    return item;
                })
                // FIX: Explicitly cast 'o' to Map<String, Object> before calling get()
                .sorted(Comparator.comparingLong(o -> (Long) ((Map<String, Object>) o).get("count")).reversed())
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}