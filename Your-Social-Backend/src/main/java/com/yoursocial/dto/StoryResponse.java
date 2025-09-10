package com.yoursocial.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class StoryResponse {

    private String image;
    private String captions;
    private LocalDateTime createdAt;
    private UserInfo userInfo;


    @Data
    @Builder
    public static class UserInfo {

        private Integer authorId;
        private String authorEmail;
        private String fullName;

        private List<Integer> followers = new ArrayList<>();
        private List<Integer> following = new ArrayList<>();

    }

}
