package com.eventzen.auth.config;

import com.eventzen.auth.entity.Role;
import com.eventzen.auth.entity.User;
import com.eventzen.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            String adminName = "Admin";
            String adminPassword = "1234";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setName(adminName);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("Default admin account created: " + adminEmail);
            } else {
                System.out.println("Default admin already exists: " + adminEmail);
            }
        };
    }
}