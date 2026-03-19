package com.gigweb.gigweb.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/files")
public class FileController {

    private final String ROOT = "uploads/";

    // CREATE FOLDER
    @PostMapping("/create-folder")
    public String createFolder(@RequestParam String name) {
        new File(ROOT + name).mkdirs();
        return "Folder Created";
    }

    // LIST FILES + FOLDERS
    @GetMapping("/list")
    public List<String> list(@RequestParam(defaultValue = "") String path) {

        File folder = new File(ROOT + path);
        String[] list = folder.list();

        if (list == null) return new ArrayList<>();

        return Arrays.asList(list);
    }

    // UPLOAD FILE
    @PostMapping("/upload")
    public String upload(@RequestParam MultipartFile file,
                         @RequestParam(defaultValue = "") String path) throws Exception {

        File dir = new File(ROOT + path);
        if (!dir.exists()) dir.mkdirs();

        File f = new File(dir, file.getOriginalFilename());
        file.transferTo(f);

        return "Uploaded";
    }

    // DELETE FILE/FOLDER
    @DeleteMapping("/delete")
    public String delete(@RequestParam String name,
                         @RequestParam(defaultValue = "") String path) {

        File f = new File(ROOT + path + "/" + name);

        if (f.isDirectory()) {
            for (File file : Objects.requireNonNull(f.listFiles())) {
                file.delete();
            }
        }

        f.delete();
        return "Deleted";
    }

    // CREATE TEXT FILE
    @PostMapping("/create-file")
    public String createFile(@RequestParam String name,
                             @RequestParam String content,
                             @RequestParam(defaultValue = "") String path) throws Exception {

        File file = new File(ROOT + path + "/" + name);
        file.getParentFile().mkdirs();

        Files.write(file.toPath(), content.getBytes());
        return "File Created";
    }

    // READ FILE
    @GetMapping("/read")
    public String read(@RequestParam String name,
                       @RequestParam(defaultValue = "") String path) throws Exception {

        File file = new File(ROOT + path + "/" + name);
        return Files.readString(file.toPath());
    }

    // UPDATE FILE
    @PostMapping("/update")
    public String update(@RequestParam String name,
                         @RequestParam String content,
                         @RequestParam(defaultValue = "") String path) throws Exception {

        File file = new File(ROOT + path + "/" + name);
        Files.write(file.toPath(), content.getBytes());

        return "Updated";
    }
}