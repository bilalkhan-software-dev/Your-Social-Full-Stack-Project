package com.yoursocial.dto;

import lombok.Data;

@Data
public class ChatRequest {

    private String chatName;

    private String chatImage;

    private Integer createdChatWithId;
}
