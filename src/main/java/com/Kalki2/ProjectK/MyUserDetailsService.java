// src/main/java/com/Kalki2/ProjectK/MyUserDetailsService.java (UPDATED: Assigns roles)
package com.Kalki2.ProjectK;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import for roles
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection; // Import for Collection

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            System.out.println("LOGIN: User not found with email: " + email);
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        System.out.println("LOGIN: User found → email = " + user.getEmail());
        System.out.println("Stored hashed password = " + user.getPassword());

        // Define authorities/roles
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Assign ADMIN role if the email matches the hardcoded admin email
        if ("admin@gmail.com".equals(user.getEmail())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            // Assign a default 'USER' role for all other users
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities // Now contains roles for Spring Security's authorization checks
        );
    }
}