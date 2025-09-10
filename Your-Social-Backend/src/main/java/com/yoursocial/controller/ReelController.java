package com.yoursocial.controller;

import com.yoursocial.dto.ReelRequest;
import com.yoursocial.dto.ReelResponse;
import com.yoursocial.endpoint.ReelsControllerEndpoint;
import com.yoursocial.services.ReelService;
import com.yoursocial.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReelController implements ReelsControllerEndpoint {

    private final ReelService reelService;
    private final CommonUtil response;

    @Override
    public ResponseEntity<?> createReel(ReelRequest request) {

        ReelResponse reel = reelService.createReel(request);
        if (!ObjectUtils.isEmpty(reel)) {
            return response.createBuildResponse("Reels added successfully!", reel, HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Reels added failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> getAllReel() {

        List<ReelResponse> allCreatedReel = reelService.allCreatedReel();

        if (!CollectionUtils.isEmpty(allCreatedReel)) {
            return response.createBuildResponse("All reel retrieved successfully!", allCreatedReel, HttpStatus.OK);
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> allUserReel() {

        List<ReelResponse> reelsOfTheLoggedInUser = reelService.getReelOfTheLoggedInUser();

        if (!CollectionUtils.isEmpty(reelsOfTheLoggedInUser)) {
            return response.createBuildResponse("Get all reel of the user retrieved successfully!", reelsOfTheLoggedInUser, HttpStatus.OK);
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> deleteUserReel(Integer reelId) {

        reelService.deleteReelOfTheUser(reelId);

        return response.createBuildResponseMessage("Reels deleted successfully!", HttpStatus.OK);
    }
}
