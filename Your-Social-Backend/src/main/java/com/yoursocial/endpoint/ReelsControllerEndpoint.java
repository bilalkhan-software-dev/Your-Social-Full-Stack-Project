package com.yoursocial.endpoint;


import com.yoursocial.dto.ReelRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Reel",description = "Create and fetch users' Reels")
@RequestMapping("/api/v1/reel")
public interface
ReelsControllerEndpoint {


    @PostMapping("/create")
    public ResponseEntity<?> createReel(@RequestBody ReelRequest request);

    @GetMapping("/all") // for all user
    public ResponseEntity<?> getAllReel();

    @GetMapping("/user/all")
    public ResponseEntity<?> allUserReel();

    @DeleteMapping("/user/delete/{reelId}")
    public ResponseEntity<?> deleteUserReel(@PathVariable Integer reelId);


}
