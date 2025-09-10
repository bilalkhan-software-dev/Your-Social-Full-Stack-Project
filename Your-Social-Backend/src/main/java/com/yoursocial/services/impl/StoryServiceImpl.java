package com.yoursocial.services.impl;

import com.yoursocial.dto.StoryRequest;
import com.yoursocial.dto.StoryResponse;
import com.yoursocial.dto.StoryResponse.UserInfo;
import com.yoursocial.entity.Story;
import com.yoursocial.entity.User;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.StoryRepository;
import com.yoursocial.repository.UserRepository;
import com.yoursocial.services.StoryService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final CommonUtil util;
    private final ModelMapper mapper;


    @Override
    public boolean createStory(StoryRequest storyRequest) {

        User user = util.getLoggedInUserDetails();
        if (user == null) {
            throw new ResourceNotFoundException("no user found");
        }

        Story story = mapper.map(storyRequest, Story.class);
        story.setCreatedAt(LocalDateTime.now());
        story.setUser(user);

        Story isSaved = storyRepository.save(story);

        return !ObjectUtils.isEmpty(isSaved);
    }

    @Override
    public List<StoryResponse> findStoryByUserId() {

        Integer userId = util.getLoggedInUserDetails().getId();

        userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("user not found")
        );

        List<Story> allStoryOfTheUser = storyRepository.findByUserId(userId);

        return allStoryOfTheUser.stream().map(story ->
                StoryResponse.builder()
                        .image(story.getImage())
                        .captions(story.getCaptions())
                        .createdAt(story.getCreatedAt())
                        .userInfo(getUserInfo(story.getUser()))
                        .build()).toList();
    }

    @Override
    public void deleteStory(Integer storyId) {
        Integer loggedInUserId = util.getLoggedInUserDetails().getId();

        Story story = storyRepository.findByIdAndUserId(storyId, loggedInUserId)
                .orElseThrow(() -> {
                    // First check if the story exists at all
                    if (!storyRepository.existsById(storyId)) {
                        return new ResourceNotFoundException("story not found");
                    }
                    // If it exists but doesn't belong to the user
                    return new IllegalArgumentException("you can't delete another user's story");
                });

        storyRepository.delete(story);
    }

    private static UserInfo getUserInfo(User user) {
        return UserInfo.builder()
                .authorId(user.getId())
                .authorEmail(user.getEmail())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .following(user.getFollowing())
                .followers(user.getFollowers())
                .build();
    }
}
