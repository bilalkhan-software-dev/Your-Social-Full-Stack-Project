package com.yoursocial.services.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;



    @Value("${spring.mail.username}")
    private String sender;

    public  void sendEmail(String to, String subject, String body) throws MessagingException, UnsupportedEncodingException {

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,"UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setFrom(sender,"Your Social (Do not reply)");
        helper.setText(body, true);
        mailSender.send(mimeMessage);
    }



}
