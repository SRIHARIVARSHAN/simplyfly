package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.PassengerReqDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.mapper.PassengerMapper;
import com.springboot.simplyfly.mapper.UserMapper;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PassengerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public void addPassenger(@Valid PassengerReqDto passengerReqDto) {
        User user=new User();
        user.setEmail(passengerReqDto.email());
        user.setName(passengerReqDto.name());
        user.setPassword(passwordEncoder.encode(passengerReqDto.password()));
        user.setPhone(passengerReqDto.phone());
        user.setRole(Role.PASSENGER);

        userRepository.save(user);

    }
}
