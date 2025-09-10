package com.yoursocial.endpoint;


import com.yoursocial.dto.MessageRequest;
import com.yoursocial.dto.MessageUpdateRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Message",description = "Send messages to other user")
@RequestMapping("/api/v1/message")
public interface MessageControllerEndpoint {

    @PostMapping("/create/chat/{chatId}")
    public ResponseEntity<?> createMessage(@PathVariable Integer chatId, @RequestBody MessageRequest messageRequest);

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<?> getAllMessageOfTheChat(@PathVariable Integer chatId);


    @PutMapping("/update/{chatId}/{messageId}")
    public ResponseEntity<?> updateMessage(@PathVariable Integer chatId,@PathVariable Integer messageId,@RequestBody MessageUpdateRequest messageRequest);

    @PutMapping("/delete/{chatId}/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Integer chatId,@PathVariable Integer messageId);


}
