package com.gigweb.gigweb.service;

import com.gigweb.gigweb.model.User;
import com.gigweb.gigweb.repository.UserRepository;
import com.gigweb.gigweb.dto.SignupRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    // SIGNUP
    public String signup(SignupRequest req) {

        if (repo.findByUsername(req.getUsername()).isPresent()) {
            return "Username already exists";
        }

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            return "Email already registered";
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));

        repo.save(user);

        return "User Registered";
    }

    // LOGIN
    public String login(String username, String password) {

        Optional<User> optionalUser = repo.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        if (encoder.matches(password, user.getPassword())) {
            return "Login Success";
        }

        return "Invalid password";
    }
}