package com.Kalki2.ProjectK; // Make sure this package matches your project's package

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component // Marks this class as a Spring component, so Spring will manage it
public class CharacterDataInitializer implements CommandLineRunner { // Renamed class

    @Autowired
    private CharacterDetailRepository characterDetailRepository; // Inject your new repository

    @Override
    public void run(String... args) throws Exception {
        // This method will run automatically when the Spring Boot application starts

        // --- Kalki Data ---
        if (characterDetailRepository.findByName("Kalki") == null) {
            CharacterDetail kalki = new CharacterDetail(
                    "Kalki",
                    "Kalki (Sanskrit: कल्कि) is the prophesied tenth and final avatar of Vishnu, who will descend to Earth at the end of the Kali Yuga (the current age of darkness and moral decline) to destroy evil and restore dharma (righteousness). He is often depicted riding a white horse named Devadatta and wielding a blazing sword, signifying his role as a purifier and destroyer of wickedness.",
                    "Divine strength, mastery over weapons, unparalleled combat skills, prophetic vision, cosmic awareness, ability to vanquish evil forces.",
                    "The prophesied final avatar of Vishnu; liberator and restorer of dharma."
            );
            characterDetailRepository.save(kalki);
            System.out.println("Seeded Kalki data.");
        }

        // --- Karna Data ---
        if (characterDetailRepository.findByName("Karna") == null) {
            CharacterDetail karna = new CharacterDetail(
                    "Karna",
                    "Karna (Sanskrit: कर्ण) is one of the central figures in the Mahabharata, known for his extraordinary martial prowess, generosity, and tragic fate. He was the son of Surya (the Sun god) and Kunti (mother of the Pandavas), but was abandoned at birth and raised by a charioteer. Despite facing constant prejudice due to his perceived low birth, he rose to prominence as a formidable warrior and remained fiercely loyal to Duryodhana, fighting on the Kaurava side in the Kurukshetra War.",
                    "Invincible Kavacha (armor) and Kundala (earrings) (until given away), celestial weaponry (e.g., Vasavi Shakti, Brahmastra), unparalleled archery skills, divine boons from various deities.",
                    "The tragic hero; unyielding loyalist; unparalleled archer and warrior."
            );
            characterDetailRepository.save(karna);
            System.out.println("Seeded Karna data.");
        }

        // --- Ashwatthama Data ---
        if (characterDetailRepository.findByName("Ashwatthama") == null) {
            CharacterDetail ashwatthama = new CharacterDetail(
                    "Ashwatthama",
                    "Ashwatthama (Sanskrit: अश्वत्थामा) is a powerful warrior in the Mahabharata, the son of Dronacharya (the royal guru to the Kauravas and Pandavas) and Kripi. He is one of the Chiranjeevis (immortals) and a formidable warrior. Known for his intense anger and his divine jewel embedded in his forehead, which grants him immense power and protection, he played a pivotal role in the Kurukshetra War, fighting fiercely for the Kauravas.",
                    "Immortality (Chiranjeevi), divine jewel in forehead (grants immense power and protection), mastery of various celestial weapons (e.g., Brahmashirsha), knowledge of all forms of warfare.",
                    "The immortal warrior; Dronacharya's son; cursed with eternal suffering."
            );
            characterDetailRepository.save(ashwatthama);
            System.out.println("Seeded Ashwatthama data.");
        }

        // --- Parasuram Data ---
        if (characterDetailRepository.findByName("Parasuram") == null) {
            CharacterDetail parasuram = new CharacterDetail(
                    "Parasuram",
                    "Parashurama (Sanskrit: परशुराम, lit. 'Rama with an axe') is the sixth avatar of Vishnu in Hinduism and one of the Chiranjeevis (immortals). He is the son of Jamadagni and Renuka. Known for his fierce temper and mastery of the axe (parashu), he is believed to have rid the world of corrupt Kshatriya warriors twenty-one times. He is a formidable guru, having taught martial arts to many legendary warriors, including Bhishma and Karna.",
                    "Immortality (Chiranjeevi), divine axe (parashu), mastery of all weapons and martial arts, immense spiritual power, ability to shapeshift.",
                    "The immortal warrior-sage; destroyer of corrupt rulers; guru to legendary heroes."
            );
            characterDetailRepository.save(parasuram);
            System.out.println("Seeded Parasuram data.");
        }

        System.out.println("Initial character data seeding complete.");
    }
}