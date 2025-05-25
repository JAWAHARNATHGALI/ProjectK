package com.Kalki2.ProjectK;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter; // Ensure this import is correct

import java.io.IOException;
import java.util.Collections;
import org.springframework.util.StringUtils; // Keep this if you want to use StringUtils.hasText()

@Component
public class JwtRequestFilter extends OncePerRequestFilter { // Ensure this extends OncePerRequestFilter

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Use the variable name from your original code
        final String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String username = null;
        String role = null; // New variable to store the role from JWT

        // Use StringUtils.hasText as in your original code
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Extract the token part after "Bearer "
            username = jwtUtil.extractUsername(jwt); // Extract username (subject) from the token

            // Try to extract the "role" claim from the JWT
            try {
                role = jwtUtil.extractClaim(jwt, claims -> claims.get("role", String.class));
            } catch (Exception e) {
                System.out.println("No 'role' claim found or could not be extracted for token: " + e.getMessage());
                role = null;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = null;
            boolean isRegularUserToken = false;
            boolean isTokenValid = false;

            // Attempt to load user details for regular users from the database
            try {
                userDetails = this.userDetailsService.loadUserByUsername(username);
                // If userDetails are loaded, it's a regular user token
                isRegularUserToken = true;
            } catch (Exception e) {
                // If userDetailsService.loadUserByUsername fails, this is expected for admin tokens
                System.out.println("User '" + username + "' not found via UserDetailsService. Could be an admin token.");
                isRegularUserToken = false; // Confirm it's not a regular user from DB
            }

            if (isRegularUserToken && userDetails != null) {
                // Validate token for a regular user (if userDetails were successfully loaded)
                isTokenValid = jwtUtil.isTokenValid(jwt, userDetails);
                if (isTokenValid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } else if ("ADMIN".equals(role)) {
                // If it's NOT a regular user (from DB) BUT the token has the "ADMIN" role claim:
                // Validate the token specifically for an admin (just check expiration, as we don't have UserDetails for them)
                // *** Now calling public isTokenExpired from JwtUtil ***
                isTokenValid = !jwtUtil.isTokenExpired(jwt);
                if (isTokenValid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, // Principal is the admin's username/email
                            null,     // Credentials are null after authentication
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))); // Grant ADMIN role
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}