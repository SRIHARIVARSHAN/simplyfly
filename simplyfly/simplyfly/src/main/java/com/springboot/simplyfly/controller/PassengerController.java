package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.request.PassengerReqDto;
import com.springboot.simplyfly.service.PassengerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/passenger")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    @PostMapping("/add")
    public void addPassenger(@Valid @RequestBody PassengerReqDto passengerReqDto){
        passengerService.addPassenger(passengerReqDto);
    }
}
