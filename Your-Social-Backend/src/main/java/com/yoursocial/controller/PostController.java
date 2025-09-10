package com.yoursocial.controller;

import com.yoursocial.dto.PostRequest;
import com.yoursocial.dto.PostResponse;
import com.yoursocial.endpoint.PostControllerEndpoint;
import com.yoursocial.services.PostService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController implements PostControllerEndpoint {

    private final PostService postService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> createPost(PostRequest postRequest) {
        PostResponse post = postService.createPost(postRequest);
        return response.createBuildResponse(
                "Post created successfully!",
                post,
                HttpStatus.CREATED
        );
    }

    @Override
    public ResponseEntity<?> allPost() {
        List<PostResponse> allPost = postService.allPost();

        if (CollectionUtils.isEmpty(allPost)) {
            return ResponseEntity.noContent().build();
        }

        return response.createBuildResponse(
                "All posts retrieved successfully",
                allPost,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> allUserPost() {
        List<PostResponse> userPosts = postService.getAllUserPost();

        if (CollectionUtils.isEmpty(userPosts)) {
            return ResponseEntity.noContent().build();
        }

        return response.createBuildResponse("All post of the user retrieved successfully!", userPosts, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> userSavedPost() {
        List<PostResponse> userSavedPosts = postService.getUserSavedPost();

        if (CollectionUtils.isEmpty(userSavedPosts)) {
            return ResponseEntity.noContent().build();
        }

        return response.createBuildResponse("All saved post of the user retrieved successfully!", userSavedPosts, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> findPostById(Integer postId) {
        PostResponse postDetails = postService.findPostById(postId);
        return response.createBuildResponse(
                "Post details retrieved successfully",
                postDetails,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> deletePost(Integer postId) {
        postService.deletePost(postId);
        return response.createBuildResponseMessage(
                "Post deleted successfully!",
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> likePost(Integer postId) {
        PostResponse postResponse = postService.likedPost(postId);
        String message = postResponse.getIsLiked()
                ? "Post liked successfully!"
                : "Post unliked successfully!";

        return response.createBuildResponse(
                message,
                postResponse,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> savePost(Integer postId) {
        PostResponse postResponse = postService.savedPost(postId);
        String message = postResponse.getIsSaved()
                ? "Post saved successfully!"
                : "Post unsaved successfully!";

        return response.createBuildResponse(
                message,
                postResponse,
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> updatePost(Integer postId, PostRequest postRequest) {

        PostResponse isUpdated = postService.updatePost(postId, postRequest);
        String message = isUpdated.getIsUpdated() ?
                "Post updated successfully!"
                : "Post update failed!";
        return response.createBuildResponse(message, isUpdated, HttpStatus.OK);

    }
}