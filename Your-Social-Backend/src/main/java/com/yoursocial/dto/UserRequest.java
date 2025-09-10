package com.yoursocial.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class UserRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String gender;
}
