package com.yoursocial.handler;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;

import java.util.LinkedHashMap;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GenericResponse {


    private HttpStatus responseStatusCode;

    private String status;

    private String message;

    private Object  data;

    public ResponseEntity<?> create(){
        Map<String,Object> map = new LinkedHashMap<>();
        map.put("status",this.status);
        map.put("message",this.message);

        if (!ObjectUtils.isEmpty(data)) {
            map.put("data", this.data);
        }

        return new ResponseEntity<>(map,this.responseStatusCode);
    }

}
