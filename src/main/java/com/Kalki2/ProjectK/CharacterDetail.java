package com.Kalki2.ProjectK; // Make sure this package matches your project's package

import jakarta.persistence.*; // Import necessary JPA annotations

@Entity // Marks this class as a JPA entity, mapping it to a database table
@Table(name = "character_details") // Specifies the table name in the database
public class CharacterDetail {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configures auto-incrementing ID
    private Long id;

    @Column(unique = true, nullable = false) // Ensures character name is unique and not null
    private String name; // e.g., "Kalki", "Karna", "Ashwatthama", "Parasuram"

    @Column(columnDefinition = "TEXT") // Use TEXT type for potentially long history
    private String history; // Detailed historical/biographical text

    @Column(columnDefinition = "TEXT")
    private String powers; // Description of powers (now includes general abilities)

    @Column(columnDefinition = "TEXT")
    private String role; // Their role in the mythology/story

    // --- Constructors ---
    public CharacterDetail() {
        // Default constructor needed by JPA
    }

    // Updated constructor without 'abilities'
    public CharacterDetail(String name, String history, String powers, String role) {
        this.name = name;
        this.history = history;
        this.powers = powers;
        this.role = role;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }

    public String getPowers() {
        return powers;
    }

    public void setPowers(String powers) {
        this.powers = powers;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "CharacterDetail{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", history='" + history + '\'' +
                ", powers='" + powers + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}