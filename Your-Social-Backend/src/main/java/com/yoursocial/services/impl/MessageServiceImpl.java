package com.yoursocial.services.impl;

import com.yoursocial.dto.ChatResponse;
import com.yoursocial.dto.MessageRequest;
import com.yoursocial.dto.MessageResponse;
import com.yoursocial.dto.MessageResponse.MessageUserDetails;
import com.yoursocial.dto.MessageUpdateRequest;
import com.yoursocial.entity.Chat;
import com.yoursocial.entity.Message;
import com.yoursocial.entity.User;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.ChatRepository;
import com.yoursocial.repository.MessageRepository;
import com.yoursocial.services.MessageService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final ModelMapper mapper;
    private final CommonUtil util;

    @Override
    public MessageResponse createdMessage(Integer chatId, MessageRequest messageRequest) {
        User loggedInUser = util.getLoggedInUserDetails();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found with id: " + chatId));

        // Verify user is part of the chat
        boolean isParticipant = chat.getUsers().stream()
                .anyMatch(user -> user.getId().equals(loggedInUser.getId()));

        if (!isParticipant) {
            throw new IllegalArgumentException("User is not part of this chat");
        }

        Message message = mapper.map(messageRequest, Message.class);
        message.setMessageCreatedAt(LocalDateTime.now());
        message.setUser(loggedInUser);
        message.setChat(chat);

        Message savedMessage = messageRepository.save(message);
        return getMessageResponse(savedMessage);
    }

    @Override
    public List<MessageResponse> findChatMessage(Integer chatId) {
        // Verify chat exists
        if (!chatRepository.existsById(chatId)) {
            throw new ResourceNotFoundException("Chat not found with id: " + chatId);
        }

        List<Message> messages = messageRepository.findByChatIdOrderByMessageCreatedAtAsc(chatId);
        return messages.stream()
                .map(this::getMessageResponse)
                .toList();
    }

    @Override
    public MessageResponse updateMessage(Integer chatId, Integer messageId, MessageUpdateRequest messageRequest) {

        Chat chat = chatRepository.findById(chatId).orElseThrow(
                () -> new ResourceNotFoundException("Chat not found with id: " + chatId)
        );
        Message message = messageRepository.findById(messageId).orElseThrow(
                () -> new ResourceNotFoundException("Message not found with id: " + messageId)
        );

        // Check if message is older than 24 hours
        if (message.getMessageCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
            throw new IllegalArgumentException("You can't update messages after 24 hours");
        }

        // Check if current user is the author of the message
        boolean isAuthor = chat.getUsers().stream()
                .anyMatch(user -> user.getId().equals(message.getUser().getId()));
        if (!isAuthor) {
            throw new IllegalArgumentException("You are not allowed to update this message");
        }

        // Update message content if provided
        if (messageRequest.getContent() != null && !messageRequest.getContent().isEmpty()) {
            message.setContent(messageRequest.getContent());
        }

        Message savedMessage = messageRepository.save(message);
        MessageResponse response = getMessageResponse(savedMessage);
        response.setIsUpdated(!savedMessage.equals(message)); // true if changes were made
        return response;
    }

    @Override
    public MessageResponse deleteMessage(Integer chatId, Integer messageId) {

        Chat chat = chatRepository.findById(chatId).orElseThrow(
                () -> new ResourceNotFoundException("Chat not found with id: " + chatId)
        );
        Message message = messageRepository.findById(messageId).orElseThrow(
                () -> new ResourceNotFoundException("Message not found with id: " + messageId)
        );
        boolean b = chat.getUsers().stream().anyMatch(user -> user.getId().equals(message.getUser().getId()));
        if (b) {
            throw new IllegalArgumentException("You are not allowed to delete this message");
        }
        message.setContent("This message has been deleted");
        message.setMessageCreatedAt(LocalDateTime.now());
        Message isDeleted = messageRepository.save(message);
        MessageResponse response = getMessageResponse(isDeleted);
        response.setIsDeleted(!isDeleted.equals(message));
        return response;
    }

    private MessageResponse getMessageResponse(Message message) {
        return MessageResponse.builder()
                .messageId(message.getId())
                .content(message.getContent())
                .image(message.getImage())
                .messageCreatedAt(message.getMessageCreatedAt())
                .messageUserDetails(MessageUserDetails.builder()
                        .userId(message.getUser().getId())
                        .fullName(message.getUser().getFirstName() + " " + message.getUser().getLastName())
                        .email(message.getUser().getEmail())
                        .build())
                .chatDetails(ChatResponse.builder()
                        .id(message.getChat().getId())
                        .chatName(message.getChat().getChatName())
                        .chatImage(message.getChat().getChatImage())
                        .chatCreatedAt(message.getChat().getChatCreatedAt())
                        .build())
                .build();
    }
}
