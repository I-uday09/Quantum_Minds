package com.gigweb.gigweb.controller;

import com.gigweb.gigweb.dto.SignupRequest;
import com.gigweb.gigweb.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService service;

    // SIGNUP
    @PostMapping("/signup")
    public String signup(@Valid @RequestBody SignupRequest req) {
        return service.signup(req);
    }

    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> req) {
        return service.login(req.get("username"), req.get("password"));
    }
}