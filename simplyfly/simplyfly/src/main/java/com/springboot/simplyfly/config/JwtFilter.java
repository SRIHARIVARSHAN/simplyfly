package com.springboot.simplyfly.config;

import com.springboot.simplyfly.service.MyUserSecurityService;
import com.springboot.simplyfly.utility.JwtUtility;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtility jwtUtility;
    private final MyUserSecurityService myUserSecurityService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Check if header is given to us, if not just exit -- this if is about extracting the username from header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extracting jwt from the header value which has prefix of 'Bearer '
            // jwt = authorizationHeader.split(" " )[1];
            jwt = authorizationHeader.substring(7);
            // Fetch username from jwt token
            username = jwtUtility.extractUsername(jwt);

        }

        // if username is given and it's not already logged in[check SecurityContextHolder].
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Fetch user details by username coming out of token
            UserDetails userDetails = myUserSecurityService.loadUserByUsername(username);

            if (jwtUtility.validateToken(jwt, userDetails.getUsername())) { // if validation is successful
                // from here on we just pass on the user details to spring's filter
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }

        }

        filterChain.doFilter(request,response);
    }
}
