package com.Kalki2.ProjectK;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjectKApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectKApplication.class, args);
	}
	// REMOVE THIS ENTIRE BLOCK:
    /*
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
    }
    */
}