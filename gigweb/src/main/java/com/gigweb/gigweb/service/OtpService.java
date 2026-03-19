package com.gigweb.gigweb.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class OtpService {

    private Map<String, String> otpStore = new HashMap<>();

    // SEND OTP (SIMULATION)
    public String sendOtp(String mobile) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        otpStore.put(mobile, otp);

        // For now just print (since no SMS API)
        System.out.println("OTP for " + mobile + " = " + otp);

        return "OTP sent (check console)";
    }

    // VERIFY OTP
    public boolean verifyOtp(String mobile, String otp) {
        return otp.equals(otpStore.get(mobile));
    }
}