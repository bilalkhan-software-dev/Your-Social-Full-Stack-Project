package com.yoursocial.controller;

import com.yoursocial.dto.MessageRequest;
import com.yoursocial.dto.MessageResponse;
import com.yoursocial.dto.MessageUpdateRequest;
import com.yoursocial.endpoint.MessageControllerEndpoint;
import com.yoursocial.services.MessageService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MessageController implements MessageControllerEndpoint {

    private final MessageService messageService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> createMessage(Integer chatId, MessageRequest messageRequest) {

        MessageResponse isMessageCreated = messageService.createdMessage(chatId, messageRequest);

        if (!ObjectUtils.isEmpty(isMessageCreated)) {
            return response.createBuildResponse("Message successfully created!", isMessageCreated, HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Message creation failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @Override
    public ResponseEntity<?> getAllMessageOfTheChat(Integer chatId) {

        List<MessageResponse> chatMessages = messageService.findChatMessage(chatId);

        if (CollectionUtils.isEmpty(chatMessages)) {
            return response.createBuildResponse("No Message were created between chats", chatMessages, HttpStatus.OK);
        }

        return response.createBuildResponse("Messages  retrieved successfully!", chatMessages, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateMessage(Integer chatId, Integer messageId, MessageUpdateRequest messageRequest) {

        MessageResponse messageResponse = messageService.updateMessage(chatId, messageId, messageRequest);
        String message = messageResponse.getIsUpdated() ? "Message updated successfully " : "Message not updated successfully ";

        return response.createBuildResponse(message, messageResponse, HttpStatus.OK);
    }


    @Override
    public ResponseEntity<?> deleteMessage(Integer chatId, Integer messageId) {
        MessageResponse messageResponse = messageService.deleteMessage(chatId, messageId);
        String message = messageResponse.getIsDeleted() ? "Message deleted successfully (Not Hard Just update it The message has been deleted) " : "Message not deleted successfully ";
        return response.createBuildResponse(message, messageResponse, HttpStatus.OK);
    }
}
