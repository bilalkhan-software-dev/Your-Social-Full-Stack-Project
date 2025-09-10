package com.yoursocial.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Version
    private Integer version;

    private String chatName;

    private String chatImage;

    @ManyToMany
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "chat",cascade = {CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REMOVE},orphanRemoval = true)
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();

    private LocalDateTime chatCreatedAt;


}
