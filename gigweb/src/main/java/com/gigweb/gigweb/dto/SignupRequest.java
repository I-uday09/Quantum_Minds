package com.gigweb.gigweb.dto;

import jakarta.validation.constraints.*;

public class SignupRequest {

    @NotBlank(message = "Username required")
    @Pattern(regexp = "^[^\\s]+$", message = "No spaces allowed")
    private String username;

    @NotBlank(message = "Email required")
    @Email(message = "Enter valid email")
    private String email;

    @NotBlank(message = "Password required")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9]).{8,}$",
        message = "Password must have 1 capital, 1 number, min 8 chars"
    )
    private String password;

    // GETTERS
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    // SETTERS
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}