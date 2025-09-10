package com.yoursocial.services;

import com.yoursocial.dto.PostRequest;
import com.yoursocial.dto.PostResponse;

import java.util.List;

public interface PostService {

    PostResponse createPost(PostRequest postRequest);

    void deletePost(Integer postId);

    PostResponse findPostById(Integer postId);

    List<PostResponse> allPost();

    PostResponse savedPost(Integer postId);

    PostResponse likedPost(Integer postId);

    List<PostResponse> getAllUserPost();

    List<PostResponse> getUserSavedPost();

    PostResponse updatePost(Integer postId,PostRequest postRequest);

}
