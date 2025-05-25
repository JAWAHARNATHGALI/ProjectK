package com.Kalki2.ProjectK;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<AppUser> signup(@RequestBody AppUser user) {
        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        AppUser savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AppUser loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        // Get the authenticated user's principal (email in this case)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Defensive check: Ensure authentication is not null and is actually authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            // This case should ideally be caught by Spring Security's filter chain before reaching here
            return ResponseEntity.status(401).body("Not authenticated.");
        }

        String userEmail = authentication.getName(); // The email is the username in your UserDetails

        // Fetch the full AppUser object from the database
        AppUser user = userRepository.findByEmail(userEmail);

        if (user != null) {
            // Return only the necessary profile details (e.g., name, favoriteCharacter, email)
            Map<String, String> profileData = new HashMap<>();
            profileData.put("name", user.getName());
            profileData.put("email", user.getEmail());
            profileData.put("gender", user.getGender());
            profileData.put("favoriteCharacter", user.getFavoriteCharacter());

            return ResponseEntity.ok(profileData); // Return the map as JSON
        } else {
            // This case might happen if the user is authenticated via an old/corrupt token
            // but the user no longer exists in the database.
            return ResponseEntity.status(404).body("User profile not found in database.");
        }
    }

    @GetMapping("/home")
    public ResponseEntity<String> getHome() {
        return ResponseEntity.ok("Access granted to protected home route!");
    }

    @GetMapping("/about")
    public ResponseEntity<String> getAbout() {
        return ResponseEntity.ok("Access granted to protected about route!");
    }

    @GetMapping("/chronicles")
    public ResponseEntity<String> getChronicles() {
        return ResponseEntity.ok("Access granted to protected chronicles route!");
    }
}