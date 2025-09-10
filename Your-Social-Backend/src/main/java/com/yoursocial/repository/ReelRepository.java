package com.yoursocial.repository;

import com.yoursocial.entity.Reel;
import com.yoursocial.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReelRepository extends JpaRepository<Reel,Integer> {


    List<Reel> findByUser(User user);

    Optional<Reel> findByIdAndUserId(Integer id, Integer userId);
}
