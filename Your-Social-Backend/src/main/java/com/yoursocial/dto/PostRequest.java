package com.yoursocial.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostRequest {

    private String caption;
    private String image;
    private String video;




}
