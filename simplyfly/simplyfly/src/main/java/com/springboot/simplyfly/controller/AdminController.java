package com.springboot.simplyfly.controller;

import com.springboot.simplyfly.dto.response.BookingHistoryDto;
import com.springboot.simplyfly.dto.response.FlightByCompanyRespDto;
import com.springboot.simplyfly.dto.response.FlightResDto;
import com.springboot.simplyfly.service.BookingService;
import com.springboot.simplyfly.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final BookingService bookingService;
    private final FlightService flightService;


    @GetMapping("/user/booking-details/{email}")
    public List<BookingHistoryDto> getUserBookingDetails(@PathVariable String email){
        return bookingService.getBookingHistory(email);
    }

    @GetMapping("/flight-details/{email}")
    public List<FlightResDto> getFlightDetails(@PathVariable String email){
        return flightService.getFlightDetails(email);
    }
}
