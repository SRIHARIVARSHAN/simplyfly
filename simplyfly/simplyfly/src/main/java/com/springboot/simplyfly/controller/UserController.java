package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.request.UserDto;
import com.springboot.simplyfly.dto.response.DisabledUserDto;
import com.springboot.simplyfly.dto.response.UserResDto;
import com.springboot.simplyfly.enums.Role;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")

@RequiredArgsConstructor

public class UserController {
    private final UserService userService;

    /*
    body{
        String name,
        String email,
        String password,
        String phone,
        Role role,
        String companyName
        }
    */
    @PostMapping("/add")
    public User add(@Valid @RequestBody UserDto userDto){return  userService.add(userDto);}

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id){
        userService.delete(id);
    }

    @PatchMapping("/enable/{id}")
    public void enableUser(@PathVariable long id){
        userService.enableUser(id);
    }

    @GetMapping("/getByRole")
    public List<UserResDto> getUserByRole(@RequestParam Role role){
        return userService.getUserByRole(role);
    }

    @GetMapping("/get-disableduser")
    public List<DisabledUserDto> getDisabledUserByRole(@RequestParam Role role){
        return userService.getDisabledUserByRole(role);
    }


}
