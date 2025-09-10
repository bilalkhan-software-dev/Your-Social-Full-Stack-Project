package com.yoursocial.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private String email ;
    private String fullName;
    private String token;

}
