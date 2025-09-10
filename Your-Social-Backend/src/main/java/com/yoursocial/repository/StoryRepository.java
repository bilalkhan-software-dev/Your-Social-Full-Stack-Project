package com.yoursocial.repository;

import com.yoursocial.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoryRepository extends JpaRepository<Story,Integer> {


    List<Story> findByUserId(Integer userId);

    Optional<Story> findByIdAndUserId(Integer storyId,Integer userId);
}
