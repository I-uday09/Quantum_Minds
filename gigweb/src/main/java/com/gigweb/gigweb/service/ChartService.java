package com.gigweb.gigweb.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ChartService {

    public Map<String, Object> generate(List<Map<String, String>> data) {

        List<String> labels = new ArrayList<>();
        List<Integer> values = new ArrayList<>();

        for (Map<String, String> row : data) {
            labels.add(row.values().iterator().next());
            values.add(Integer.parseInt(row.values().toArray()[1].toString()));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("values", values);

        return result;
    }
}