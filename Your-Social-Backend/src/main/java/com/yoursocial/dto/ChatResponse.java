package com.yoursocial.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import com.yoursocial.dto.MessageResponse.MessageUserDetails;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ChatResponse {

    private Integer id;
    private String chatName;
    private String chatImage;
    private LocalDateTime chatCreatedAt;

    private boolean isChatCreated;
    private boolean isChatAlreadyCreated;

    public ChatResponse withIsChatCreated(boolean isChatCreated) {
        this.isChatCreated = isChatCreated;
        return this;
    }

    public ChatResponse withIsChatAlreadyCreated(boolean isChatAlreadyCreated) {
        this.isChatAlreadyCreated = isChatAlreadyCreated;
        return this;
    }

    @Builder.Default
    private List<UserResponse> users = new ArrayList<>();

    @Builder.Default
    private List<MessageResponse> messages = new ArrayList<>();


    @Data
    @Builder
    public static class UserResponse {

        private Integer userId;
        private String fullName;
        private String email;
        private String image;

    }

    @Data
    @Builder
    public static class MessageResponse {
        private Integer id;
        private String content;
        private String image;
        private LocalDateTime createdAt;
        private MessageUserDetails messageUserDetails;
    }
}
