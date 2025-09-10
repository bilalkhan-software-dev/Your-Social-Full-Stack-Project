package com.yoursocial.repository;

import com.yoursocial.entity.Chat;
import com.yoursocial.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat,Integer> {

    List<Chat> findByUsersId(Integer userId);

    @Query("select c from Chat c where :user member of c.users and :reqUser member of c.users")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Chat findChatBetweenUsers(@Param("user")User user,@Param("reqUser") User reqUser);

    Optional<Chat> findByIdAndUsersId(Integer chatId, Integer loggedInUser);
}
