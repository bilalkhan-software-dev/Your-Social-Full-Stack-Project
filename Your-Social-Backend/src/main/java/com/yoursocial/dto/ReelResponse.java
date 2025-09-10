package com.yoursocial.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ReelResponse {

    private Integer id;
    private String title;
    private String video;
    private LocalDateTime createdAt;

    private UserInfo userInfo;


    @Data
    @Builder
    public static class UserInfo {

        private Integer authorId;
        private String authorEmail;
        private String fullName;
        private String image;

        @Builder.Default
        private List<Integer> followers = new ArrayList<>();

        @Builder.Default
        private List<Integer> following = new ArrayList<>();
    }


}
