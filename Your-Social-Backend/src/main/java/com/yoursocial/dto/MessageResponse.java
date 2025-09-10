package com.yoursocial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private Integer messageId;
    private String content;
    private String image;
    private LocalDateTime messageCreatedAt;
    private MessageUserDetails messageUserDetails;
    private ChatResponse chatDetails;

    private Boolean isUpdated = false;
    private Boolean isDeleted = false;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MessageUserDetails {
        private Integer userId;
        private String fullName;
        private String email;
        private String image;
    }
}

