package com.yoursocial.controller;

import com.yoursocial.dto.ChatRequest;
import com.yoursocial.dto.ChatResponse;
import com.yoursocial.endpoint.ChatControllerEndpoint;
import com.yoursocial.services.ChatService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController implements ChatControllerEndpoint {

    private final ChatService chatService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> createChat(ChatRequest chatRequest) {
        ChatResponse chatResponse = chatService.createChat(chatRequest);

        if (chatResponse.isChatAlreadyCreated()) {
            return response.createBuildResponse(
                    "Chat already exists between these users",
                    chatResponse,
                    HttpStatus.OK
            );
        }

        return response.createBuildResponse(
                "Chat created successfully!",
                chatResponse,
                HttpStatus.CREATED
        );
    }

    @Override
    public ResponseEntity<?> allChatsOfTheLoggedInCreatedUser() {
        List<ChatResponse> chats = chatService.getAllCreatedChatsOfTheUser();

        if (CollectionUtils.isEmpty(chats)) {
            return ResponseEntity.noContent().build();
        }

        return response.createBuildResponse(
                "All chats retrieved successfully",
                chats,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> chatDetailsByID(Integer chatId) {
        ChatResponse chatDetail = chatService.findChatById(chatId);
        return response.createBuildResponse(
                "Chat details retrieved successfully",
                chatDetail,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> deleteChatOfTheUser(Integer chatId) {
        chatService.deleteChatOfTheAuthenticateUser(chatId);
        return response.createBuildResponseMessage(
                "Chat deleted successfully!",
                HttpStatus.OK
        );
    }
}
