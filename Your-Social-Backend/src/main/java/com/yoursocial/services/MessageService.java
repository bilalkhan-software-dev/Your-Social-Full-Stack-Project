package com.yoursocial.services;

import com.yoursocial.dto.MessageRequest;
import com.yoursocial.dto.MessageResponse;
import com.yoursocial.dto.MessageUpdateRequest;
import org.aspectj.bridge.IMessageContext;

import java.util.List;

public interface MessageService {

    MessageResponse createdMessage(Integer chatId, MessageRequest messageRequest);

    List<MessageResponse> findChatMessage(Integer chatId);

    MessageResponse deleteMessage(Integer chatId, Integer messageId);

    MessageResponse updateMessage(Integer chatId, Integer messageId, MessageUpdateRequest messageRequest);

}
