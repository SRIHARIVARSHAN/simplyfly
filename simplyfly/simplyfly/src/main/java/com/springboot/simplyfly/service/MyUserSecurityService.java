package com.springboot.simplyfly.service;

import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserSecurityService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndIsActiveTrue(username)
                .orElseThrow(()-> new UsernameNotFoundException("User Credentials Invalid"));

        return user;
    }
}