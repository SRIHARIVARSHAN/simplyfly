package com.springboot.simplyfly.mapper;

import com.springboot.simplyfly.dto.request.PassengerReqDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.model.Passenger;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PassengerMapper {

//    private static final UserRepository userRepository;
//    public static User convertDtoToEntity(@Valid PassengerReqDto passengerReqDto) {
//        User user=new User();
//        user.setEmail(passengerReqDto.email());
//        user.setName(passengerReqDto.name());
//        user.setPassword(passengerReqDto.password());
//        user.setPhone(passengerReqDto.phone());
//        user.setRole(Role.PASSENGER);
//
//        return userRepository.save(user);
//    }
}
