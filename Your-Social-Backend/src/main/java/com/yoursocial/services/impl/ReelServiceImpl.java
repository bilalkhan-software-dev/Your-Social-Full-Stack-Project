package com.yoursocial.services.impl;

import com.yoursocial.dto.ReelRequest;
import com.yoursocial.dto.ReelResponse;
import com.yoursocial.dto.ReelResponse.UserInfo;

import com.yoursocial.entity.Reel;
import com.yoursocial.entity.User;
import com.yoursocial.exception.ResourceNotFoundException;
import com.yoursocial.repository.ReelRepository;
import com.yoursocial.services.ReelService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReelServiceImpl implements ReelService {

    private final ReelRepository reelRepository;
    private final CommonUtil util;
    private final ModelMapper mapper;

    @Override
    public ReelResponse createReel(ReelRequest request) {

        User loggedInUser = util.getLoggedInUserDetails();

        Reel reel = mapper.map(request, Reel.class);
        reel.setCreatedAt(LocalDateTime.now());
        reel.setUser(loggedInUser);

        Reel isReelSaved = reelRepository.save(reel);

        ReelResponse response = null;
        if (!ObjectUtils.isEmpty(isReelSaved)) {
            response = ReelResponse.builder()
                    .createdAt(isReelSaved.getCreatedAt())
                    .title(isReelSaved.getTitle())
                    .video(isReelSaved.getVideo())
                    .id(isReelSaved.getId())
                    .userInfo(getUserInfo(isReelSaved.getUser()))
                    .build();
        }

        return response;
    }

    @Override
    public List<ReelResponse> allCreatedReel() {

        List<Reel> allReel = reelRepository.findAll();


        return allReel.stream().map(reel ->
                ReelResponse.builder()
                        .createdAt(reel.getCreatedAt())
                        .title(reel.getTitle())
                        .video(reel.getVideo())
                        .id(reel.getId())
                        .userInfo(getUserInfo(reel.getUser()))
                        .build()
        ).toList();
    }

    @Override
    public List<ReelResponse> getReelOfTheLoggedInUser() {

        User loggedInUser = util.getLoggedInUserDetails();

        List<Reel> allReelOfTheUser = reelRepository.findByUser(loggedInUser);

        return allReelOfTheUser.stream().map(reel ->
                ReelResponse.builder()
                        .createdAt(reel.getCreatedAt())
                        .title(reel.getTitle())
                        .video(reel.getVideo())
                        .id(reel.getId())
                        .userInfo(getUserInfo(reel.getUser()))
                        .build()
        ).toList();
    }

    @Override
    public void deleteReelOfTheUser(Integer reelId) {

        Integer loggedInUserId = util.getLoggedInUserDetails().getId();

        Reel isReelPresentAndUserAuthenticate = reelRepository.findByIdAndUserId(reelId, loggedInUserId)
                .orElseThrow(() -> {
                    // First check if the story exists at all
                    if (!reelRepository.existsById(reelId)) {
                        return new ResourceNotFoundException("Reel not found");
                    }
                    // If it exists but doesn't belong to the user
                    return new IllegalArgumentException("You can't delete another user's reels");
                });

        reelRepository.delete(isReelPresentAndUserAuthenticate);

    }


    private static UserInfo getUserInfo(User user) {
        return UserInfo.builder()
                .authorId(user.getId())
                .authorEmail(user.getEmail())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .image(user.getImage())
                .following(user.getFollowing())
                .followers(user.getFollowers())
                .build();
    }

}
