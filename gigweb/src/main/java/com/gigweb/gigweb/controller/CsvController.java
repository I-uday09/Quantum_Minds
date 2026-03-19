package com.gigweb.gigweb.controller;

import com.gigweb.gigweb.service.CsvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/csv")
public class CsvController {

    @Autowired
    private CsvService service;

    @PostMapping("/upload")
    public List<Map<String, String>> upload(@RequestParam MultipartFile file) {
        return service.parse(file);
    }
}