package com.yoursocial.services.impl;

import com.yoursocial.dto.ResetPasswordRequest;
import com.yoursocial.dto.UpdateUserRequest;
import com.yoursocial.dto.UserResponse;
import com.yoursocial.dto.UserResponse.PostResponse;
import com.yoursocial.entity.User;
import com.yoursocial.exception.ResetPasswordException;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.UserRepository;
import com.yoursocial.services.UserService;
import com.yoursocial.util.CommonUtil;
import com.yoursocial.util.EmailSendingTemplate;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.yoursocial.util.AppConstant.OTP_EXPIRATION_MINUTES;
import static com.yoursocial.util.AppConstant.PASSWORD_FINAL_LENGTH;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final CommonUtil util;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom random = new SecureRandom();

    @Override
    public UserResponse showUserProfile() {

        Integer id = util.getLoggedInUserDetails().getId();

        User user = userRepo.findWithSavedPostsById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found!")
        );

        return getUserResponse(user);
    }

    @Override
    public UserResponse findUserById(Integer userId) {

        User user = userRepo.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not available or created with id: " + userId)
        );

        return getUserResponse(user);
    }

    @Override
    public UserResponse findUserByEmail(String email) {

        User user = userRepo.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User not available or created with email: " + email)
        );

        return getUserResponse(user);
    }


    @Override
    public UserResponse updateUser(UpdateUserRequest userRequest) {

        Integer userId = util.getLoggedInUserDetails().getId();
        User existingUser = userRepo.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id:" + userId)
        );


        if (userRequest.getFirstName() != null) {
            existingUser.setFirstName(userRequest.getFirstName());
        }
        if (userRequest.getLastName() != null) {
            existingUser.setLastName(userRequest.getLastName());
        }
        if (userRequest.getGender() != null) {
            existingUser.setGender(userRequest.getGender());
        }

        if (userRequest.getBio() != null) {
            existingUser.setBio(userRequest.getBio());
        }

        if (userRequest.getBanner() != null) {
            existingUser.setBanner(userRequest.getBanner());
        }

        if (userRequest.getImage() != null) {
            existingUser.setImage(userRequest.getImage());
        }

        User isUpdated = userRepo.save(existingUser);
        UserResponse userResponse = null;

        if (!ObjectUtils.isEmpty(isUpdated)) {
            userResponse = getUserResponse(isUpdated);
        }
        return userResponse;
    }

    @Override
    public List<UserResponse> getAllUsers() {

        List<User> userList = userRepo.findAll();

        return userList.stream().map(this::getUserResponse)
                .toList();
    }

    @Override
    public void deleteUser(Integer userId) {

        User user = userRepo.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id : " + userId)
        );

        userRepo.delete(user);

    }

    @Override
    public UserResponse followUser(Integer userId) {

        Integer loggedInUserId = util.getLoggedInUserDetails().getId();

        if (loggedInUserId.equals(userId)) {
            throw new IllegalArgumentException("You can't follow/unfollow yourself");
        }

        User follower = userRepo.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + loggedInUserId));
        User followee = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));


        boolean isFollowing = follower.getFollowing().contains(userId);

        UserResponse response = null;

        if (isFollowing) {
            follower.getFollowing().remove(userId);
            followee.getFollowers().remove(loggedInUserId);
            User save = userRepo.save(follower);
            userRepo.save(followee);
            response = getUserResponse(save);
            response.setIsFollowed(false);
        } else {
            follower.getFollowing().add(userId);
            followee.getFollowers().add(loggedInUserId);
            User saved = userRepo.save(follower);
            userRepo.save(followee);
            response = getUserResponse(saved);
            response.setIsFollowed(true);
        }
        return response;
    }


    @Override
    public List<UserResponse> searchUser(String query) {

        List<User> searchedUser = userRepo.searchUser(query);

        return searchedUser.stream().map(this::getUserResponse).toList();
    }

    @Override
    public boolean sendResetPasswordOTP(String email) throws MessagingException, UnsupportedEncodingException {

        User user = userRepo.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User not found with email: " + email)
        );
        int otp = generateOTP();

        String body = EmailSendingTemplate.sendEmailForPasswordReset(user.getFirstName(), otp);
        emailService.sendEmail(user.getEmail(), "Reset password Your Social Account", body);
        log.info("User email:{} OTP Code: {}", user.getEmail(), otp);

        user.setResetPasswordCode(otp);
        user.setOtpGeneratedTime(LocalDateTime.now());
        User isUserSaved = userRepo.save(user);

        return !ObjectUtils.isEmpty(isUserSaved);
    }

    @Override
    public boolean verifyResetPasswordOTP(Integer otp, String email) {

        User user = userRepo.findByResetPasswordCodeAndEmail(otp, email).orElseThrow(
                () -> new ResetPasswordException("Invalid OTP")
        );

        if (isOtpExpired(user.getOtpGeneratedTime())) {
            user.setResetPasswordCode(null);
            user.setOtpGeneratedTime(null);
            userRepo.save(user);
            throw new ResetPasswordException("OTP has expired. Generate again for reset password");
        }

        user.setOtpGeneratedTime(null);
        User isSuccessfullyVerifiedOtp = userRepo.save(user);

        return !ObjectUtils.isEmpty(isSuccessfullyVerifiedOtp);
    }

    @Override
    public boolean resetPasswordOTP(ResetPasswordRequest request) {

        User user = userRepo.findByEmail(request.getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("User not found with email: " + request.getEmail())
        );

        if (user.getResetPasswordCode() == null) {
            throw new ResetPasswordException("Password reset not initialized or OTP has expired");
        }
        if (request.getNewPassword().length() < PASSWORD_FINAL_LENGTH) {
            throw new ResetPasswordException("Password must contain 8 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordCode(null);
        User isPasswordSuccessfullyReset = userRepo.save(user);

        return !ObjectUtils.isEmpty(isPasswordSuccessfullyReset);
    }

    private int generateOTP() {
        return 100000 + random.nextInt(900000);
    }

    private boolean isOtpExpired(LocalDateTime otpGeneratedTime) {
        return otpGeneratedTime == null ||
                otpGeneratedTime.plusMinutes(OTP_EXPIRATION_MINUTES)
                        .isBefore(LocalDateTime.now());
    }

    public UserResponse getUserResponse(User user) {

        User loggedInUserId = util.getLoggedInUserDetails();

        boolean ifLoggedInUserFollowedUser = Optional.ofNullable(loggedInUserId.getFollowing()).orElse(Collections.emptyList()).contains(user.getId());


        return UserResponse.builder()
                .id(user.getId())
                .gender(user.getGender())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .image(user.getImage())
                .banner(user.getBanner())
                .following(user.getFollowing())
                .isRequestedUser(false)
                .followers(user.getFollowers())
                .isFollowed(ifLoggedInUserFollowedUser)
                .savedPost(user.getSavedPost().stream().map(post -> PostResponse.builder()
                        .postId(post.getId())
                        .image(post.getImage())
                        .video(post.getVideo())
                        .caption(post.getCaption())
                        .likedByUserIds(post.getLike().stream().map(User::getId).toList())
                        .createdAt(post.getCreatedAt())
                        .authorId(post.getUser().getId())
                        .authorEmail(post.getUser().getEmail())
                        .build()).toList())
                .build();
    }
}
