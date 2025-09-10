package com.yoursocial.services;

import com.yoursocial.dto.ChatRequest;
import com.yoursocial.dto.ChatResponse;

import java.util.List;

public interface ChatService {

    ChatResponse createChat(ChatRequest chatRequest);

    ChatResponse findChatById(Integer chatId);

    List<ChatResponse> getAllCreatedChatsOfTheUser();

    void deleteChatOfTheAuthenticateUser(Integer chatId);


}
