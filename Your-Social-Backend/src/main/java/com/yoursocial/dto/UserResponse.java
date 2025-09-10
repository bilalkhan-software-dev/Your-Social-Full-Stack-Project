package com.yoursocial.dto;


import lombok.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {


    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String image;
    private String banner;
    private String bio;

    private List<Integer> followers = new ArrayList<>();
    private List<Integer> following = new ArrayList<>();

    @Builder.Default
    private Boolean isFollowed = false;

    @Builder.Default
    private Boolean isRequestedUser = false ;

    private List<PostResponse> savedPost = new ArrayList<>();

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Getter
    @Setter
    public static class PostResponse {

        private Integer postId;
        private String caption;
        private String image;
        private String video;

        private Integer authorId;
        private String authorEmail;

        private List<Integer> likedByUserIds = new ArrayList<>();
        private LocalDateTime createdAt;
    }

}
