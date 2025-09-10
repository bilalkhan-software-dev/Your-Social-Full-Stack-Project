package com.yoursocial.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {

    private Integer id;
    private String content;
    private UserResponse user;
    private LocalDateTime commentCreatedAt;

    private Integer totalLikesOnComment;
    private List<UserResponse> commentLikedByUsers = new ArrayList<>();


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponse {

        private Integer id;
        private String email;

        private List<Integer> followers = new ArrayList<>();
        private List<Integer> following = new ArrayList<>();

        private List<PostResponse> savedPost = new ArrayList<>();
    }


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PostResponse {

        private Integer postId;
        private String caption;
        private String image;
        private String video;

        private Integer authorId;
        private String authorEmail;

        private List<Integer> postLikeByUserIds = new ArrayList<>();
        private LocalDateTime createdAt;

    }

}
