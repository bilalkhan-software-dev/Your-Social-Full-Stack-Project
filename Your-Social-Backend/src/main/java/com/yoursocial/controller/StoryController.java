package com.yoursocial.controller;

import com.yoursocial.dto.StoryRequest;
import com.yoursocial.dto.StoryResponse;
import com.yoursocial.endpoint.StoryControllerEndpoint;
import com.yoursocial.services.StoryService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StoryController implements StoryControllerEndpoint {


    private final StoryService storyService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> createStory(StoryRequest storyRequest) {

        boolean isStoryAdded = storyService.createStory(storyRequest);

        if (isStoryAdded) {
            return response.createBuildResponseMessage("Story added successfully!", HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Story added failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> userStory() {

        List<StoryResponse> userAddedStory = storyService.findStoryByUserId();
        if (CollectionUtils.isEmpty(userAddedStory)) {
            return ResponseEntity.noContent().build();
        }

        return response.createBuildResponse("Get all user story retrieved successfully!",userAddedStory, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteUserStory(Integer storyId) {

        storyService.deleteStory(storyId);

        return response.createErrorResponseMessage("Story deleted successfully!", HttpStatus.OK);
    }
}
