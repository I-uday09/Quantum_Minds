package com.gigweb.gigweb.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @PostMapping
    public String chat(@RequestBody Map<String, String> req) {
        return "AI: " + req.get("message");
    }
}