package com.gigweb.gigweb.service;

import com.opencsv.CSVReader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.*;

@Service
public class CsvService {

    public List<Map<String, String>> parse(MultipartFile file) {

        List<Map<String, String>> list = new ArrayList<>();

        try {
            CSVReader reader = new CSVReader(
                    new InputStreamReader(file.getInputStream()));

            String[] header = reader.readNext();
            String[] line;

            while ((line = reader.readNext()) != null) {

                Map<String, String> row = new HashMap<>();

                for (int i = 0; i < header.length; i++) {
                    row.put(header[i], line[i]);
                }

                list.add(row);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
}