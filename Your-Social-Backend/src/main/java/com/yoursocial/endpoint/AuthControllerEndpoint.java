package com.yoursocial.endpoint;

import com.yoursocial.dto.LoginRequest;
import com.yoursocial.dto.ResetPasswordRequest;
import com.yoursocial.dto.UserRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@Tag(name = "Authentication",description = "Authenticate user API's")
@RequestMapping("/api/v1/auth") // not required authentication
public interface AuthControllerEndpoint {

    @PostMapping("/check/{email}")
    public ResponseEntity<?> checkUsernameTakenOrNot(@PathVariable String email);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest);

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest user);

    @GetMapping("/reset-password-request/{email}")
    public ResponseEntity<?> sendEmailForResetPassword(@PathVariable String email) throws MessagingException, UnsupportedEncodingException;

    @GetMapping("/verify-otp/{otp}/{email}")
    public ResponseEntity<?> verifyOTP(@PathVariable Integer otp,@PathVariable String email);

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest);

}