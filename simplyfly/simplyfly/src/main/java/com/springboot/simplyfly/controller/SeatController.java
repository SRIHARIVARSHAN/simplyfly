package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.response.SeatResDto;
import com.springboot.simplyfly.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/flight/{flightId}")
    public List<SeatResDto> getSeatsByFLightId(@PathVariable Integer flightId){
        return seatService.getSeatsByFlightId(flightId);
    }
}
