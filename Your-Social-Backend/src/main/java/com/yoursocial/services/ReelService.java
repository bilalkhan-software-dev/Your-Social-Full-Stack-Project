package com.yoursocial.services;

import com.yoursocial.dto.ReelRequest;
import com.yoursocial.dto.ReelResponse;

import java.util.List;

public interface ReelService {

    ReelResponse createReel(ReelRequest request);

    List<ReelResponse> allCreatedReel();

    List<ReelResponse> getReelOfTheLoggedInUser();

    void deleteReelOfTheUser(Integer reelId);





}
