package com.yoursocial.util;

import com.yoursocial.config.security.CustomUserDetails;
import com.yoursocial.entity.User;
import com.yoursocial.handler.GenericResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CommonUtil {

    public ResponseEntity<?> createBuildResponse(String message,Object data, HttpStatus httpStatusCode) {

        GenericResponse response = GenericResponse.builder()
                .responseStatusCode(httpStatusCode)
                .status("success")
                .message(message)
                .data(data)
                .build();

        return response.create();
    }

    public ResponseEntity<?> createBuildResponseMessage(String message, HttpStatus httpStatusCode) {
        GenericResponse response = GenericResponse.builder()
                .responseStatusCode(httpStatusCode)
                .status("success")
                .message(message)
                .build();
        return response.create();
    }

    public ResponseEntity<?> createErrorResponse(String message,Object data, HttpStatus httpStatusCode) {
        GenericResponse response = GenericResponse.builder()
                .responseStatusCode(httpStatusCode)
                .status("failed!")
                .message(message)
                .data(data)
                .build();
        return response.create();
    }

    public ResponseEntity<?> createErrorResponseMessage(String message, HttpStatus httpStatusCode) {
        GenericResponse response = GenericResponse.builder()
                .responseStatusCode(httpStatusCode)
                .status("failed!")
                .message(message)
                .build();
        return response.create();
    }

    public User getLoggedInUserDetails(){
        try {

            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            return userDetails.getUser();
        }catch (Exception e){
            throw e;
        }
    }

}
