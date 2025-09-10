package com.yoursocial.endpoint;


import com.yoursocial.dto.ChatRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Tag(name = "Chat",description = "Create and fetch chats")
@RequestMapping("/api/v1/chat")
public interface ChatControllerEndpoint {

    @PostMapping("/create")
    public ResponseEntity<?> createChat(@RequestBody ChatRequest chatRequest);

    @GetMapping("/user/all")
    public ResponseEntity<?> allChatsOfTheLoggedInCreatedUser();

    @GetMapping("/{chatId}")
    public ResponseEntity<?> chatDetailsByID(@PathVariable Integer chatId);

    @DeleteMapping("/user/delete/{chatId}")
    public ResponseEntity<?> deleteChatOfTheUser(@PathVariable Integer chatId);


}
