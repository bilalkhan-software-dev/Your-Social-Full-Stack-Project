package com.yoursocial.services.impl;

import com.yoursocial.entity.User;
import com.yoursocial.exception.JwtTokenExpiredException;
import com.yoursocial.services.JwtService;

import static com.yoursocial.util.AppConstant.SECRET_KEY;
import static com.yoursocial.util.AppConstant.JWT_TOKEN_EXPIRATION;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.util.*;

@Slf4j
@Service
public class JwtServiceImpl implements JwtService {

    private String secretKey = SECRET_KEY;

    public JwtServiceImpl() {
        try {

            KeyGenerator instance = KeyGenerator.getInstance("HmacSHA256");
            SecretKey generatedKey = instance.generateKey();
            secretKey = Base64.getEncoder().encodeToString(generatedKey.getEncoded());
        } catch (Exception e) {
            log.error("Failed to generate token jwtServiceImpl() => 28 Errors :{}", e.getMessage());
        }
    }

    @Override
    public String generateToken(User user) {

        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("id", user.getId());
        claims.put("full name", user.getFirstName() + " " + user.getLastName());

        return Jwts.builder().
                claims().add(claims)
                .subject(user.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + JWT_TOKEN_EXPIRATION))
                .and()
                .signWith(getKey())
                .compact();
    }

    private Key getKey() {
        byte[] key = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(key);
    }

    private SecretKey decryptKey(String token) {
        byte[] decodedKey = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(decryptKey(token))
                    .build().parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new JwtTokenExpiredException("Token is expired");
        } catch (JwtException e) {
            throw new JwtTokenExpiredException("Jwt token is invalid");
        } catch (Exception e) {
            log.error("Error when extracting claims :{}", e.getMessage());
            throw e;
        }

    }


    @Override
    public String extractUsername(String token) {

        Claims extractedAllClaims = extractAllClaims(token);

        return extractedAllClaims.getSubject();
    }


    private boolean isTokenExpired(String token){

        Claims extractedAllClaims = extractAllClaims(token);
        Date expiration = extractedAllClaims.getExpiration();
        return expiration.before(new Date());
    }


    @Override
    public boolean validateToken(String token, UserDetails userDetails) {

        String username = extractUsername(token); // username <=> email

        boolean isExpired = isTokenExpired(token);

        return username.equalsIgnoreCase(userDetails.getUsername()) && !isExpired;
    }
}
