package com.eventzen.auth.controller;

import com.eventzen.auth.entity.User;
import com.eventzen.auth.service.UserService;
import com.eventzen.auth.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Map<String, String> loginUser(@RequestBody User user) {

        Optional<User> existingUser = userService.getUserByEmail(user.getEmail());

        if (existingUser.isEmpty() ||
            !passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        User dbUser = existingUser.get();

        String token = jwtUtil.generateToken(
                dbUser.getEmail(),
                dbUser.getRole().name()
        );

        return Map.of("token", token);
    }

    @GetMapping("/me")
    public User getMyDetails(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token missing");
        }

        String token = authHeader.substring(7);

        String email = jwtUtil.extractUsername(token);

        return userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}