package com.yoursocial.config.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.yoursocial.handler.GenericResponse;
import com.yoursocial.services.JwtService;
import static com.yoursocial.util.AppConstant.AUTHORIZATION_HEADER;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("JwtFilter doFilterInternal() Start");

        // Bearer token = Bearer *************.*********.*************
        try {

            String authHeader = request.getHeader(AUTHORIZATION_HEADER);

            String token = null;
            String username = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                log.info("token :{}",token);
                username = jwtService.extractUsername(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    boolean isTokenValid = jwtService.validateToken(token, userDetails);
                    if (isTokenValid) {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }

                }

            }
        } catch (Exception e) {
            handleJwtException(response,e);
            log.error("JwtFilter line no 60 error :{}",e.getMessage());
            return;
        }

        log.info("JwtFilter doFilterInternal() End");
        filterChain.doFilter(request,response);
    }

    private void handleJwtException(HttpServletResponse response, Exception e) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        Object errors = GenericResponse.builder()
                .status("failed!")
                .message(e.getMessage())
                .responseStatusCode(HttpStatus.UNAUTHORIZED)
                .build().create().getBody();
        response.getWriter().write(new ObjectMapper().writeValueAsString(errors));
    }

}
