package com.yoursocial.services;

import com.yoursocial.dto.CommentRequest;
import com.yoursocial.dto.CommentResponse;

import java.util.List;
import java.util.Map;

public interface CommentService {

    CommentResponse createComment(CommentRequest commentRequest, Integer postId);

    CommentResponse findCommentById(Integer commentId);

    List<CommentResponse> getAllCommentsOfThePost(Integer postId);

    List<CommentResponse> allComments();

    Map<String,Object> likeComment(Integer commentId);

}
