package com.yoursocial.controller;

import com.yoursocial.dto.LoginRequest;
import com.yoursocial.dto.LoginResponse;
import com.yoursocial.dto.ResetPasswordRequest;
import com.yoursocial.dto.UserRequest;
import com.yoursocial.endpoint.AuthControllerEndpoint;
import com.yoursocial.services.AuthService;
import com.yoursocial.services.UserService;
import com.yoursocial.util.CommonUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController implements AuthControllerEndpoint {

    private final AuthService authService;
    private final UserService userService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> checkUsernameTakenOrNot(String email) {

        boolean isAlreadyTaken = authService.checkUsernameAlreadyTakenOrNot(email);
        if (isAlreadyTaken) {
            return response.createBuildResponseMessage("Email already taken", HttpStatus.OK);
        }

        return response.createBuildResponseMessage("Email is available", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> registerUser(UserRequest userRequest) {

        boolean isRegistered = authService.registerUser(userRequest);

        if (isRegistered) {
            return response.createBuildResponseMessage("Account created successfully", HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Account not created! Something wrong on server", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> login(LoginRequest user) {

        log.info("user login email: {}  password: {}", user.getEmail(), user.getPassword());

        LoginResponse loginResponse = authService.login(user);

        if (!ObjectUtils.isEmpty(loginResponse)) {
            return response.createBuildResponse("User login Successfully!", loginResponse, HttpStatus.OK);
        }

        return response.createErrorResponseMessage("Invalid credentials", HttpStatus.UNAUTHORIZED
        );
    }

    @Override
    public ResponseEntity<?> sendEmailForResetPassword(String email) throws MessagingException, UnsupportedEncodingException {

        boolean isEmailSend = userService.sendResetPasswordOTP(email);
        if (isEmailSend) {
            return response.createBuildResponse("OTP sent successfully to your email!", email, HttpStatus.OK);
        }

        return response.createErrorResponseMessage("OTP send failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @Override
    public ResponseEntity<?> verifyOTP(Integer otp, String email) {

        boolean isOtpVerified = userService.verifyResetPasswordOTP(otp, email);
        if (isOtpVerified) {
            return response.createBuildResponse("OTP verified successfully!", email, HttpStatus.OK);
        }
        return response.createErrorResponseMessage("OTP verified failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> resetPassword(ResetPasswordRequest resetPasswordRequest) {

        boolean isPasswordReset = userService.resetPasswordOTP(resetPasswordRequest);
        if (isPasswordReset) {
            return response.createBuildResponseMessage("Password reset successfully!", HttpStatus.OK);
        }

        return response.createErrorResponseMessage("Password reset failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
