package com.yoursocial.endpoint;


import com.yoursocial.dto.PostRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Post",description = "Create,read,update,delete,save and like post")
@RequestMapping("/api/v1/post")
public interface PostControllerEndpoint {

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody PostRequest postRequest);

    @GetMapping("/all")
    public ResponseEntity<?> allPost();

    @GetMapping("/user/all")
    public ResponseEntity<?> allUserPost();

    @GetMapping("/user/save/all")
    public ResponseEntity<?> userSavedPost();

    @GetMapping("/{postId}")
    public ResponseEntity<?> findPostById(@PathVariable Integer postId);

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Integer postId
    );

    @PutMapping("/like/{postId}")
    public ResponseEntity<?> likePost(@PathVariable Integer postId);

    @PutMapping("/saved/{postId}")
    public ResponseEntity<?> savePost(@PathVariable Integer postId);

    @PutMapping("/update/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Integer postId,@RequestBody PostRequest postRequest);



}
