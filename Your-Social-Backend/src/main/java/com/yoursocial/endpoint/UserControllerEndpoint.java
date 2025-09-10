package com.yoursocial.endpoint;

import com.yoursocial.dto.UpdateUserRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Tag(name = "User", description = "Users related API's")
@RequestMapping("/api/v1/user") // required authentication
public interface UserControllerEndpoint {

    @DeleteMapping("/delete/{userId}") //  for admin
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId);

    @GetMapping("/profile")
    public ResponseEntity<?> useProfile();


    @GetMapping("/all") // for admin
    public ResponseEntity<?> getAllUsers();

    @GetMapping("/search/{query}")
    public ResponseEntity<?> searchUser(@PathVariable String query);

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest userRequest);

    @PutMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable("userId") Integer followedUserId);

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDetailsById(@PathVariable Integer userId);


}
