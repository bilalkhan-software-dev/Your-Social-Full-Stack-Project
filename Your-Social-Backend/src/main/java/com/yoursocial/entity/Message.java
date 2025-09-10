package com.yoursocial.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    private String image; // storing image url in database

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnore
    private Chat chat;

    private LocalDateTime messageCreatedAt;


}
