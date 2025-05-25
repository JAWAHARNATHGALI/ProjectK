
package com.Kalki2.ProjectK;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByEmail(String email); // Add this to query user by email
}