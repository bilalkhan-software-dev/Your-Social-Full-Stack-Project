package com.yoursocial.controller;

import com.yoursocial.dto.CommentRequest;
import com.yoursocial.dto.CommentResponse;
import com.yoursocial.endpoint.CommentControllerEndpoint;
import com.yoursocial.services.CommentService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CommentController implements CommentControllerEndpoint {

    private final CommentService commentService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> createPost(CommentRequest commentRequest, Integer postId) {

        CommentResponse comment = commentService.createComment(commentRequest, postId);


        if (!ObjectUtils.isEmpty(comment)) {
            return response.createBuildResponse("Comment added successfully in post id:" + postId, comment,HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Comment not added", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<?> getAllCommentOfThePost(Integer postId) {

        List<CommentResponse> allCommentsOfThePost = commentService.getAllCommentsOfThePost(postId);

        if (CollectionUtils.isEmpty(allCommentsOfThePost)) {
            return ResponseEntity.noContent().build();
        }

        return response.createBuildResponse("Retrieved all comment on the post",allCommentsOfThePost, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllComment() {

        List<CommentResponse> allComment = commentService.allComments();

        if (CollectionUtils.isEmpty(allComment)) {
            return ResponseEntity.noContent().build();
        }
        return response.createBuildResponse("Retrieved all comments => for Admin",allComment, HttpStatus.OK);
    }


    @Override
    public ResponseEntity<?> detailsOfTheComment(Integer commentId) {

        CommentResponse commentDetails = commentService.findCommentById(commentId);

        if (ObjectUtils.isEmpty(commentDetails)) {
            return response.createErrorResponseMessage("Comment is empty", HttpStatus.BAD_REQUEST);
        }

        return response.createBuildResponse("Retrieved comment details",commentDetails, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> likeComment(Integer commentId) {

        Map<String, Object> response = commentService.likeComment(commentId);
        if (response.get("status").equals("liked")) {
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Comment liked successfully",
                            "likeCount", response.get("likeCount")
                    ));
        } else {
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Comment disliked successfully",
                            "likeCount", response.get("likeCount")
                    ));
        }
    }


}
