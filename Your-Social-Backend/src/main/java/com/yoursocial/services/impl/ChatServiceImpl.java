package com.yoursocial.services.impl;

import com.yoursocial.dto.ChatRequest;
import com.yoursocial.dto.ChatResponse;
import com.yoursocial.dto.ChatResponse.UserResponse;
import com.yoursocial.dto.ChatResponse.MessageResponse;
import com.yoursocial.dto.MessageResponse.MessageUserDetails;
import com.yoursocial.entity.Chat;
import com.yoursocial.entity.User;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.ChatRepository;
import com.yoursocial.repository.UserRepository;
import com.yoursocial.services.ChatService;
import com.yoursocial.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final CommonUtil util;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ChatResponse createChat(ChatRequest chatRequest) {
        User loggedInUser = util.getLoggedInUserDetails();
        Integer createdChatWithId = chatRequest.getCreatedChatWithId();

        User reqUser = userRepository.findById(createdChatWithId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + createdChatWithId));

        // Check if chat already exists between these users
        Chat existingChat = chatRepository.findChatBetweenUsers(loggedInUser, reqUser);
        if (existingChat != null) {
            return getChatResponse(existingChat)
                    .withIsChatAlreadyCreated(true)
                    .withIsChatCreated(false);
        }

        // Create new chat
        Chat chat = new Chat();
        chat.setChatName(chatRequest.getChatName());
        chat.setChatImage(chatRequest.getChatImage());
        chat.setChatCreatedAt(LocalDateTime.now());
        chat.setUsers(List.of(loggedInUser, reqUser));

        Chat savedChat = chatRepository.save(chat);
        return getChatResponse(savedChat)
                .withIsChatCreated(true)
                .withIsChatAlreadyCreated(false);
    }

    @Override
    public ChatResponse findChatById(Integer chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found with ID: " + chatId));
        return getChatResponse(chat);
    }

    @Override
    public List<ChatResponse> getAllCreatedChatsOfTheUser() {
        Integer loggedInUserId = util.getLoggedInUserDetails().getId();
        List<Chat> chats = chatRepository.findByUsersId(loggedInUserId);
        return chats.stream().map(this::getChatResponse).toList();
    }

    @Override
    public void deleteChatOfTheAuthenticateUser(Integer chatId) {
        Integer loggedInUserId = util.getLoggedInUserDetails().getId();
        Chat chat = chatRepository.findByIdAndUsersId(chatId, loggedInUserId)
                .orElseThrow(() -> {
                    if (!chatRepository.existsById(chatId)) {
                        return new ResourceNotFoundException("Chat not found with id: " + chatId);
                    }
                    return new IllegalArgumentException("You can't delete another user's chat");
                });
        chatRepository.delete(chat);
    }

    private ChatResponse getChatResponse(Chat chat) {
        return ChatResponse.builder()
                .id(chat.getId())
                .chatName(chat.getChatName())
                .chatImage(chat.getChatImage())
                .chatCreatedAt(chat.getChatCreatedAt())
                .isChatCreated(true)
                .isChatAlreadyCreated(false)
                .users(chat.getUsers().stream()
                        .map(user -> UserResponse.builder()
                                .userId(user.getId())
                                .fullName(user.getFirstName() + " " + user.getLastName())
                                .email(user.getEmail())
                                .image(user.getImage())
                                .build())
                        .toList())
                .messages(chat.getMessages().stream()
                        .map(message -> MessageResponse.builder()
                                .id(message.getId())
                                .content(message.getContent())
                                .image(message.getImage())
                                .createdAt(message.getMessageCreatedAt())
                                .messageUserDetails(MessageUserDetails.builder()
                                        .email(message.getUser().getEmail())
                                        .fullName(message.getUser().getFirstName() + " " + message.getUser().getLastName())
                                        .image(message.getUser().getImage())
                                        .userId(message.getUser().getId())
                                        .build())
                                .build()
                        ).toList())
                .build();
    }
}
