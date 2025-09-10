package com.yoursocial.services;

import com.yoursocial.dto.StoryRequest;
import com.yoursocial.dto.StoryResponse;

import java.util.List;

public interface StoryService {

    boolean createStory(StoryRequest storyRequest);

    List<StoryResponse> findStoryByUserId();

    void deleteStory(Integer storyId);




}
