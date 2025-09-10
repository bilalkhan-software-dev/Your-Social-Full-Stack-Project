package com.yoursocial.config.websocket;


import com.yoursocial.dto.MessageResponse;
import com.yoursocial.entity.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Slf4j
@Controller
public class RealTimeChat {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatId}") // Matches frontend's /app/chat/{chatId}
    public void distributeMessage(
            @Payload MessageResponse messages,
            @DestinationVariable String chatId
    ) {
        // Just relay, no persistence
        log.info("Web Socket Message Received: {}", messages);
        messagingTemplate.convertAndSendToUser(
                chatId,
                "/private",  // Matches frontend subscription
                messages
        );
    }
}
