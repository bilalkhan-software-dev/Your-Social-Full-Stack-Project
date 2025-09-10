package com.yoursocial.services.impl;

import com.yoursocial.dto.CommentRequest;
import com.yoursocial.dto.CommentResponse;
import com.yoursocial.dto.CommentResponse.UserResponse;
import com.yoursocial.dto.CommentResponse.PostResponse;
import com.yoursocial.entity.Comment;
import com.yoursocial.entity.Post;
import com.yoursocial.entity.User;
import com.yoursocial.exception.DuplicateLikeException;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.CommentRepository;
import com.yoursocial.repository.PostRepository;
import com.yoursocial.services.CommentService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {


    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommonUtil util;
    private final ModelMapper mapper;


    @Override
    public CommentResponse createComment(CommentRequest commentRequest, Integer postId) {

        User isUserLoggedIn = util.getLoggedInUserDetails();

        Post post = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("post not found")
        );


        Comment comment = mapper.map(commentRequest, Comment.class);

        comment.setUser(isUserLoggedIn);
        comment.setCommentCreatedAt(LocalDateTime.now());


        Comment isCommentCreated = commentRepository.save(comment);
        post.getComments().add(comment);
        Post isCommentSavedInPost = postRepository.save(post);

        CommentResponse commentResponse = null;

        if ((!ObjectUtils.isEmpty(isCommentCreated) && !ObjectUtils.isEmpty(isCommentSavedInPost))){

            commentResponse = CommentResponse.
                    builder()
                    .id(isCommentCreated.getId())
                    .content(isCommentCreated.getContent())
                    .commentCreatedAt(isCommentCreated.getCommentCreatedAt())
                    .totalLikesOnComment(isCommentCreated.getLiked().size())
                    .commentLikedByUsers(isCommentCreated.getLiked().stream().map(this::getUserResponse).toList())
                    .user(getUserResponse(isCommentCreated.getUser()))
                    .build();
        }
        return commentResponse;
    }

    @Override
    public CommentResponse findCommentById(Integer commentId) {


        Comment isCommentPresent = commentRepository.findById(commentId).orElseThrow(
                () -> new ResourceNotFoundException("comment not created or not found")
        );

        return CommentResponse.
                builder()
                .id(isCommentPresent.getId())
                .content(isCommentPresent.getContent())
                .commentCreatedAt(isCommentPresent.getCommentCreatedAt())
                .totalLikesOnComment(isCommentPresent.getLiked().size())
                .commentLikedByUsers(isCommentPresent.getLiked().stream().map(this::getUserResponse).toList())
                .user(getUserResponse(isCommentPresent.getUser()))
                .build();
    }

    @Override
    public List<CommentResponse> getAllCommentsOfThePost(Integer postId) {

        Post post = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("post not found")
        );

        List<Comment> comments = post.getComments();

        return comments.stream().map(comment -> CommentResponse.
                builder()
                .id(comment.getId())
                .content(comment.getContent())
                .commentCreatedAt(comment.getCommentCreatedAt())
                .commentLikedByUsers(comment.getLiked().stream().map(this::getUserResponse).toList())
                .totalLikesOnComment(comment.getLiked().size())
                .user(getUserResponse(comment.getUser()))
                .build()).toList();
    }

    @Override
    public List<CommentResponse> allComments() {

        List<Comment> allComments = commentRepository.findAll();

        return allComments.stream().map(comment -> CommentResponse.
                builder()
                .id(comment.getId())
                .content(comment.getContent())
                .commentCreatedAt(comment.getCommentCreatedAt())
                .commentLikedByUsers(comment.getLiked().stream().map(this::getUserResponse).toList())
                .totalLikesOnComment(comment.getLiked().size())
                .user(getUserResponse(comment.getUser()))
                .build()).toList();
    }

    @Override
    public Map<String, Object> likeComment(Integer commentId) {
        User user = util.getLoggedInUserDetails();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Initialize a liked set if null
        if (comment.getLiked() == null) {
            comment.setLiked(new ArrayList<>());
        }

        boolean isLiked;
        List<User> likedUsers = comment.getLiked();

        // Check if user already liked the comment
        boolean alreadyLiked = likedUsers.stream()
                .anyMatch(u -> u.getId().equals(user.getId()));

        if (alreadyLiked) {
            // Unlike the comment
            likedUsers.removeIf(u -> u.getId().equals(user.getId()));
            isLiked = false;
        } else {
            // Like the comment
            likedUsers.add(user);
            isLiked = true;
        }

        try {
            commentRepository.save(comment);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateLikeException("Failed to update like status - possible concurrent modification");
        }

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("status", isLiked ? "liked" : "unliked");
        response.put("likeCount", likedUsers.size());
        response.put("commentId", commentId);
        response.put("userId", user.getId());

        return response;
    }

    private UserResponse getUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .following(user.getFollowing())
                .followers(user.getFollowers())
                .savedPost(user.getSavedPost().stream().map(post -> PostResponse.builder()
                        .postId(post.getId())
                        .image(post.getImage())
                        .video(post.getVideo())
                        .caption(post.getCaption())
                        .postLikeByUserIds(post.getLike().stream().map(User::getId).toList())
                        .createdAt(post.getCreatedAt())
                        .authorId(post.getUser().getId())
                        .authorEmail(post.getUser().getEmail())
                        .build()).toList())
                .build();
    }
}
