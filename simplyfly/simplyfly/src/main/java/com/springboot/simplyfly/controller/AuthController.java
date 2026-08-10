package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.request.AdminDto;
import com.springboot.simplyfly.dto.response.TokenDto;
import com.springboot.simplyfly.dto.response.UserLoginRespDto;
import com.springboot.simplyfly.model.User;
import com.springboot.simplyfly.service.UserService;
import com.springboot.simplyfly.utility.JwtUtility;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtility jwtUtility;
    private Logger logger =  LoggerFactory.getLogger("AuthController.class");


    @PostMapping("/add/admin")
    public void addAdmin(@RequestBody AdminDto adminDto){
        userService.addAdmin(adminDto);
    }

    @GetMapping("/login")
    public TokenDto login(Principal principal){
        String loggedInUsername =principal.getName();

        String token= jwtUtility.generateToken(loggedInUsername);

        logger.info("Token Generated {}", token );
        User user=userService.getUserDetails(loggedInUsername);

        logger.info("User Details fetched from DB having role: {}", user.getRole());
        logger.info("Token Expiry {}", jwtUtility.extractExpiration(token).toString());

        return  new TokenDto(
                token,
                jwtUtility.extractExpiration(token).toString(),
                user.getRole().toString()
        );
    }

    @GetMapping("/user-details")
    public UserLoginRespDto getUserDetails(Principal principal){

        logger.info("Fetching details of User {}", principal.getName());
        String loggedinUsername=principal.getName();
        User user=userService.getUserDetails(loggedinUsername);
        return new UserLoginRespDto(
                loggedinUsername,
                user.getRole().toString()
        );
    }
}
