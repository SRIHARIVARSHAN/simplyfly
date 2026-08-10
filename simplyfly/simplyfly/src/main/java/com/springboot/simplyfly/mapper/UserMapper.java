package com.springboot.simplyfly.mapper;

import com.springboot.simplyfly.dto.request.UserDto;
import com.springboot.simplyfly.dto.response.DisabledUserDto;
import com.springboot.simplyfly.dto.response.UserResDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.model.User;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserMapper {

    public static User convertDtoToEntity(UserDto userDto) {
        User user=new User();
        user.setName(userDto.name());
        user.setEmail(userDto.email());
        user.setPassword(userDto.password());
        user.setPhone(userDto.phone());
        user.setRole(userDto.role());
        user.setCompanyName(userDto.companyName());

        return  user;

    }

    public static UserResDto convertEntityToDto(User user){
        Optional<String> securedCompany = (user.getRole() == Role.FLIGHT_OWNER)
                    ? Optional.ofNullable(user.getCompanyName()) // Assumes User entity has getCompanyName()
                : Optional.empty();

        return new UserResDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                securedCompany
        );
    }

    public static DisabledUserDto convertEntityToDtoForDisabled(User user){
        Optional<String> securedCompany = (user.getRole() == Role.FLIGHT_OWNER)
                ? Optional.ofNullable(user.getCompanyName()) // Assumes User entity has getCompanyName()
                : Optional.empty();

        return new DisabledUserDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                securedCompany
        );
    }



}
