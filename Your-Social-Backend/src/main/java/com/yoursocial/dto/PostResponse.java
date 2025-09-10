package com.yoursocial.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class PostResponse {
    private Integer postId;
    private String caption;
    private String image;
    private String video;
    private Integer authorId;
    private String authorEmail;
    private String authorFirstName;
    private String authorLastName;
    private String authorProfilePic;

    private Boolean isUpdated;

    @Builder.Default
    private Boolean isLiked = false;
    @Builder.Default
    private Boolean isSaved = false;

    private Integer postLikesCount;
    private Integer commentsCount;
    private Integer savesCount;
    @Builder.Default
    private List<Integer> likedByUserIds = new ArrayList<>();
    @Builder.Default
    private List<CommentResponse> comments = new ArrayList<>();
    private LocalDateTime createdAt;

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Getter
    @Setter
    public static class CommentResponse {
        private Integer commentId;
        private String content;
        private LocalDateTime createAt;
        private CommentUserDetails commentUserDetails;
        @Builder.Default
        private List<Integer> commentLikes = new ArrayList<>();

        @Builder.Default
        private Boolean isLiked = false;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Getter
    @Setter
    public static class CommentUserDetails {
        private Integer id;
        private String firstName;
        private String lastName;
        private String profilePic;
        private String email;
    }
}