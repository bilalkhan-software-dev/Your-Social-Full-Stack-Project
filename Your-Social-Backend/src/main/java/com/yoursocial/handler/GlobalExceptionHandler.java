package com.yoursocial.handler;


import com.yoursocial.exception.*;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final CommonUtil util;


    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        log.error("Unhandled exception :{}", e.getMessage());
        return util.createErrorResponseMessage("An unexpected error => " + e.getMessage() + " <= occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResetPasswordException.class)
    public ResponseEntity<?> handleOTPException(ResetPasswordException e) {
        log.error("Invalid otp exception :{}", e.getMessage());
        return util.createErrorResponseMessage("Invalid OTP", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> nullPointerException(NullPointerException e) {
        log.error("Null pointer exception: ", e);
        return util.createErrorResponseMessage("Something went wrong => " + e.getMessage() + " <= Please contact support.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> missingParameterException(MissingServletRequestParameterException e) {
        log.error("Missing request parameter: {}", e.getMessage());
        return util.createErrorResponseMessage("Missing parameter: " + e.getParameterName(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException e) {
        log.error("Resource not found: {}", e.getMessage());
        return util.createErrorResponseMessage(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateLikeException.class)
    public ResponseEntity<?> resourceNotFoundException(DuplicateLikeException e) {
        log.error("duplicate key exist: {}", e.getMessage());
        return util.createErrorResponseMessage(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> accessDeniedException(AccessDeniedException e) {
        log.error("Access denied: {}", e.getMessage());
        return util.createErrorResponseMessage("You do not have permission to perform this action.", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ExistDataException.class)
    public ResponseEntity<?> existDataException(ExistDataException e) {
        log.error("Data already exists: {}", e.getMessage());
        return util.createErrorResponseMessage(e.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> httpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("Malformed request body: {}", e.getMessage());
        return util.createErrorResponseMessage("Malformed JSON request", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> illegalArgumentException(IllegalArgumentException e) {
        log.error("Illegal argument: {}", e.getMessage());
        return util.createErrorResponseMessage(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> badCredentialsException(BadCredentialsException e) {
        log.error("Bad credentials: {}", e.getMessage());
        return util.createErrorResponseMessage("Invalid username or password", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtTokenExpiredException.class)
    public ResponseEntity<?> jwtTokenExpiredException(JwtTokenExpiredException e) {
        log.error("JWT token expired: {}", e.getMessage());
        return util.createErrorResponseMessage("Session expired. Please log in again.", HttpStatus.UNAUTHORIZED);
    }


}
