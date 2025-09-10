package com.yoursocial.repository;

import com.yoursocial.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    Optional<Message> findByIdAndUserId(Integer id, Integer userId);


    List<Message> findByChatId(Integer chatId);

    List<Message> findByChatIdOrderByMessageCreatedAtAsc(Integer chatId);

    /*
     *     findBy: Indicates a query operation
     *     ChatId: Filters messages by the chat ID
     *     OrderByMessageCreatedAtAsc: Sorts the results by the messageCreatedAt field in ascending order (older first)
     *     For descending order (newest first), you would use OrderByMessageCreatedAtDesc
     */


}
