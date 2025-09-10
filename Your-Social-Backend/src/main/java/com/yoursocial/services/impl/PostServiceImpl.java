package com.yoursocial.services.impl;

import com.yoursocial.dto.PostRequest;
import com.yoursocial.dto.PostResponse;
import com.yoursocial.dto.PostResponse.CommentResponse;
import com.yoursocial.dto.PostResponse.CommentUserDetails;
import com.yoursocial.entity.Comment;
import com.yoursocial.entity.Post;
import com.yoursocial.entity.User;
import com.yoursocial.exception.DuplicateLikeException;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.PostRepository;
import com.yoursocial.repository.UserRepository;
import com.yoursocial.services.PostService;
import com.yoursocial.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final CommonUtil util;

    @Override
    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
        Integer userId = util.getLoggedInUserDetails().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = mapper.map(postRequest, Post.class);
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        return getPostResponse(savedPost);
    }

    @Override
    public void deletePost(Integer postId) {
        Integer userId = util.getLoggedInUserDetails().getId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));


        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can't delete another user's post");
        }

        // when deleting post also removing it from the save post list
        post.getSavedByUsers().forEach(user -> {
            user.getSavedPost().remove(post);
            userRepository.save(user);
        });
        postRepository.delete(post);
    }

    @Override
    public PostResponse findPostById(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return getPostResponse(post);
    }

    @Override
    public List<PostResponse> allPost() {

        return postRepository.findAll().stream()
                .map(this::getPostResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getAllUserPost() {

        User loggedInUser = util.getLoggedInUserDetails();

        List<Post> loggedInUserPosts = postRepository.findByUser(loggedInUser);
        return loggedInUserPosts.stream().map(this::getPostResponse).toList();
    }

    @Override
    public List<PostResponse> getUserSavedPost() {
        User loggedInUser = util.getLoggedInUserDetails();

        List<Post> savePost = userRepository.findSavedPostsByUser(loggedInUser);
        return savePost.stream().map(this::getPostResponse).toList();
    }

    @Transactional
    @Override
    public PostResponse likedPost(Integer postId) {
        User user = util.getLoggedInUserDetails();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // Initialize like a list if null
        if (post.getLike() == null) {
            post.setLike(new ArrayList<>());
        }

        List<User> likes = post.getLike();
        boolean isAlreadyLiked = likes.stream().anyMatch(u -> u.getId().equals(user.getId()));

        if (isAlreadyLiked) {
            // Unlike the post
            likes.removeIf(u -> u.getId().equals(user.getId()));
        } else {
            // Like the post
            likes.add(user);
        }

        try {
            Post updatedPost = postRepository.save(post);
            PostResponse response = getPostResponse(updatedPost);
            response.setIsLiked(!isAlreadyLiked); // Set the opposite of previous state
            return response;
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateLikeException("Error processing like action");
        }
    }

    @Override
    @Transactional
    public PostResponse savedPost(Integer postId) {
        Integer userId = util.getLoggedInUserDetails().getId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isCurrentlySaved = user.getSavedPost().contains(post);

        if (isCurrentlySaved) {
            // Unsaving the post
            user.getSavedPost().remove(post);
            post.getSavedByUsers().remove(user);
        } else {
            // Saving the post
            user.getSavedPost().add(post);
            post.getSavedByUsers().add(user);
        }

        userRepository.save(user);
        postRepository.save(post);

        PostResponse response = getPostResponse(post);
        response.setIsSaved(!isCurrentlySaved);
        return response;
    }

    @Transactional
    @Override
    public PostResponse updatePost(Integer postId, PostRequest postRequest) {

        Integer loggedInUser = util.getLoggedInUserDetails().getId();


        Post existingPost = postRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("Post not found with id: " + postId)
        );

        if (!existingPost.getUser().getId().equals(loggedInUser)) {
            throw new IllegalArgumentException("You can't update another user post");
        }

        if (postRequest.getVideo() != null) {
            existingPost.setVideo(postRequest.getVideo());
        }

        if (postRequest.getImage() != null) {
            existingPost.setImage(postRequest.getImage());
        }

        if (postRequest.getCaption() != null) {
            existingPost.setCaption(postRequest.getCaption());
        }

        Post isUpdated = postRepository.save(existingPost);

        PostResponse updateResponse = null;

        if (!ObjectUtils.isEmpty(isUpdated)) {
            updateResponse = getPostResponse(isUpdated);
            updateResponse.setIsUpdated(true);
        } else {
            updateResponse = getPostResponse(existingPost);
            updateResponse.setIsUpdated(false);
        }

        return updateResponse;
    }

    private PostResponse getPostResponse(Post post) {

        User author = post.getUser();

        User loggedInUser = util.getLoggedInUserDetails();

        // sever side logic if post is saved and like by loggedInUser also if comment is liked by loggedInUser (currentUser)
        List<User> likes = post.getLike();
        List<Comment> comments = post.getComments();
        List<Post> savedPost = loggedInUser.getSavedPost();

        boolean isPostLikedByCurrentUser = likes.stream().filter(Objects::nonNull).anyMatch(u -> u.getId().equals(loggedInUser.getId()));
        boolean isSavedPostByCurrentUser = savedPost.stream().anyMatch(p -> p != null && p.getId().equals(post.getId()));
        return PostResponse.builder()
                .postId(post.getId())
                .caption(post.getCaption())
                .image(post.getImage())
                .createdAt(post.getCreatedAt())
                .video(post.getVideo())
                .isLiked(isPostLikedByCurrentUser)
                .isSaved(isSavedPostByCurrentUser)
                .authorId(author.getId())
                .authorEmail(author.getEmail())
                .authorFirstName(author.getFirstName())
                .authorLastName(author.getLastName())
                .authorProfilePic(author.getImage())
                .postLikesCount(post.getLike().size())
                .commentsCount(post.getComments().size())
//                .savesCount(!post.getSavedByUsers().isEmpty() ? post.getSavedByUsers().size() :  0)
                .savesCount(post.getSavedByUsers().size())
                .likedByUserIds(post.getLike().stream().map(User::getId).toList())
                .comments(comments.stream().map(comment -> {
                            boolean isThisLikeByCurrentUser = comment.getLiked().stream().anyMatch(u -> u.getId().equals(loggedInUser.getId()));
                            return CommentResponse.builder()
                                    .commentId(comment.getId())
                                    .content(comment.getContent())
                                    .createAt(comment.getCommentCreatedAt())
                                    .isLiked(isThisLikeByCurrentUser)
                                    .commentUserDetails(CommentUserDetails.builder()
                                            .id(comment.getUser().getId())
                                            .firstName(comment.getUser().getFirstName())
                                            .lastName(comment.getUser()
                                                    .getLastName())
                                            .profilePic(comment.getUser().getImage())
                                            .email(comment.getUser().getEmail())
                                            .build())
                                    .commentLikes(comment.getLiked().stream().map(User::getId).toList())
                                    .build();
                        }).toList()
                )
                .build();
    }
}
