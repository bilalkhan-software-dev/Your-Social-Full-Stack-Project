package com.yoursocial.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;
    private String password;
    private String gender;

    @Column(length = 100)
    private String bio;

    @Column(length = 400)
    private String image;

    @Column(length = 400)
    private String banner;

    @Column(length = 10)
    private Integer resetPasswordCode;

    private LocalDateTime otpGeneratedTime;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Integer> followers = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Integer> following = new ArrayList<>();


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    List<Post> savedPost = new ArrayList<>();

}



