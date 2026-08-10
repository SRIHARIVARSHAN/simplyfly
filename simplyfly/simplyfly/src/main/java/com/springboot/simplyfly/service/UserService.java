package com.springboot.simplyfly.service;

import com.springboot.simplyfly.dto.request.AdminDto;
import com.springboot.simplyfly.dto.request.UserDto;
import com.springboot.simplyfly.dto.response.DisabledUserDto;
import com.springboot.simplyfly.dto.response.UserResDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.exception.InvalidCredentialsException;
import com.springboot.simplyfly.exception.ResourceNotFoundException;
import com.springboot.simplyfly.mapper.UserMapper;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User add(UserDto userDto) {
        User user= UserMapper.convertDtoToEntity(userDto);
        user.setPassword(passwordEncoder.encode(userDto.password()));
        return userRepository.save(user);
    }

    public void delete(long id) {
        User user=userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    public List<UserResDto> getUserByRole(Role role) {
        List<User> list=userRepository.getUserByRole(role);
        return list.stream()
                .map(UserMapper::convertEntityToDto)
                .toList();
    }

    public void addAdmin(AdminDto adminDto) {

        User user = new User();
        user.setEmail(adminDto.email());
        user.setName(adminDto.name());
        user.setPassword(passwordEncoder.encode(adminDto.password()));
        user.setPhone(adminDto.phone());
        user.setRole(Role.ADMIN);

        userRepository.save(user);
    }

    public User getUserDetails(String email) {
        return  userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(()-> new InvalidCredentialsException("Login Denied"));
    }

    public void enableUser(long id) {
        User user=userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
    }

    public List<DisabledUserDto> getDisabledUserByRole(Role role) {
        List<User> list=userRepository.getDisabledUserByRole(role);
        return list.stream()
                .map(UserMapper::convertEntityToDtoForDisabled)
                .toList();



    }
}
